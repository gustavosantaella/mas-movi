import { WS_URL } from '@/constants';

export interface PaymentNotification {
  driverId: number;
  fare: number;
  ts: number;
}

type PaymentListener = (payment: PaymentNotification) => void;

let ws: WebSocket | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let registeredDriverId: number | null = null;
let listeners: PaymentListener[] = [];
let isConnecting = false;

function connect() {
  if (isConnecting || (ws && ws.readyState === WebSocket.OPEN)) return;
  isConnecting = true;

  try {
    ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      isConnecting = false;
      console.log('[PaymentSocket] Connected');

      // Re-register if we had a driverId
      if (registeredDriverId !== null) {
        ws?.send(JSON.stringify({ type: 'register-driver', driverId: registeredDriverId }));
      }
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data as string);
        if (msg.type === 'payment-received') {
          const payment: PaymentNotification = {
            driverId: msg.driverId,
            fare: msg.fare,
            ts: msg.ts,
          };
          listeners.forEach((fn) => fn(payment));
        }
      } catch {}
    };

    ws.onclose = () => {
      isConnecting = false;
      ws = null;
      // Auto-reconnect if a driver is registered
      if (registeredDriverId !== null) {
        reconnectTimer = setTimeout(connect, 3000);
      }
    };

    ws.onerror = () => {
      isConnecting = false;
      ws?.close();
    };
  } catch {
    isConnecting = false;
  }
}

/**
 * CONDUCTOR: Register to receive payment notifications for this driver.
 */
export function registerDriver(driverId: number) {
  registeredDriverId = driverId;
  connect();

  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'register-driver', driverId }));
  }
}

/**
 * CONDUCTOR: Unregister and disconnect.
 */
export function unregisterDriver() {
  registeredDriverId = null;
  listeners = [];
  if (reconnectTimer) clearTimeout(reconnectTimer);
  reconnectTimer = null;
  ws?.close();
  ws = null;
}

/**
 * CONDUCTOR: Listen for incoming payments.
 * Returns an unsubscribe function.
 */
export function onPaymentReceived(listener: PaymentListener): () => void {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((fn) => fn !== listener);
  };
}

/**
 * PASSENGER: Send payment notification to a specific driver.
 */
export function sendPayment(driverId: number, fare: number) {
  connect();

  const msg = JSON.stringify({
    type: 'payment',
    driverId,
    fare,
    ts: Date.now(),
  });

  // If already connected, send immediately
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(msg);
    return;
  }

  // Otherwise wait for connection then send
  const checkInterval = setInterval(() => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      clearInterval(checkInterval);
      ws.send(msg);
    }
  }, 100);

  // Give up after 3s
  setTimeout(() => clearInterval(checkInterval), 3000);
}
