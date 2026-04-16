import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

/**
 * WebSocket Gateway for real-time driver ↔ passenger communication.
 *
 * ## Events (Driver):
 * - `driver:join`    → Driver joins a room identified by their sessionId
 * - Receives `passenger:scanned` → +1 passenger counter
 * - Receives `passenger:paid`    → Full payment data (amount, passengerId, lat, lng)
 *
 * ## Events (Passenger):
 * - `passenger:scan`  → Passenger scanned a driver's QR
 * - `passenger:pay`   → Passenger confirmed payment
 */
@WebSocketGateway({
  cors: { origin: '*' },
})
export class PaymentGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger('PaymentGateway');

  // Track which driver socket → sessionId
  private driverSessions = new Map<string, string>();
  // Track driverId → sessionId for HTTP status lookups
  private activeDrivers = new Map<number, string>();

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    // Clean up both maps
    const sessionId = this.driverSessions.get(client.id);
    if (sessionId) {
      for (const [driverId, sid] of this.activeDrivers.entries()) {
        if (sid === sessionId) {
          this.activeDrivers.delete(driverId);
          this.logger.log(`Driver ${driverId} session ended`);
          break;
        }
      }
    }
    this.driverSessions.delete(client.id);
  }

  // ─── Driver Events ───────────────────────────────────

  /**
   * Driver opens QR screen → joins a room with their sessionId.
   * Payload: { sessionId: string, driverId: number }
   */
  @SubscribeMessage('driver:join')
  handleDriverJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sessionId: string; driverId: number },
  ) {
    const { sessionId, driverId } = data;
    client.join(sessionId);
    this.driverSessions.set(client.id, sessionId);
    this.activeDrivers.set(driverId, sessionId);
    this.logger.log(
      `Driver ${driverId} joined session: ${sessionId}`,
    );
    return { event: 'driver:joined', data: { sessionId } };
  }

  /// Check if a driver has an active session (used by HTTP controller).
  isDriverActive(driverId: number): { active: boolean; sessionId?: string } {
    const sessionId = this.activeDrivers.get(driverId);
    return sessionId ? { active: true, sessionId } : { active: false };
  }

  // ─── Passenger Events ────────────────────────────────

  /**
   * Passenger scanned the driver's QR.
   * Notifies the driver with +1 passenger.
   * Payload: { sessionId: string, passengerId: number }
   */
  @SubscribeMessage('passenger:scan')
  handlePassengerScan(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      sessionId: string;
      passengerId: number;
    },
  ) {
    const { sessionId, passengerId } = data;
    this.logger.log(
      `Passenger ${passengerId} scanned session ${sessionId}`,
    );

    // Notify the driver room
    this.server.to(sessionId).emit('passenger:scanned', {
      passengerId,
      timestamp: new Date().toISOString(),
    });

    return { event: 'scan:ack', data: { success: true } };
  }

  /**
   * Passenger confirmed payment.
   * Sends full payment data to the driver.
   * Payload: { sessionId, passengerId, amount, lat, lng }
   */
  @SubscribeMessage('passenger:pay')
  handlePassengerPay(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      sessionId: string;
      passengerId: number;
      amount: number;
      lat: number;
      lng: number;
    },
  ) {
    const { sessionId, passengerId, amount, lat, lng } = data;
    this.logger.log(
      `Payment from passenger ${passengerId}: Bs.${amount} → session ${sessionId}`,
    );

    // Notify the driver
    this.server.to(sessionId).emit('passenger:paid', {
      passengerId,
      amount,
      lat,
      lng,
      timestamp: new Date().toISOString(),
    });

    return { event: 'pay:ack', data: { success: true } };
  }
}
