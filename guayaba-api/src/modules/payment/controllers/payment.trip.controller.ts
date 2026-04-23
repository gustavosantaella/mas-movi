import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { BaseController } from '../../../core/base.controller.js';
import { TripService } from '../../trip/services/trip.service.js';
import { CreateTripDto, UpdateTripDto } from '../../trip/controllers/models/trip.dto.js';
import { UserService } from '../../user/services/user.service.js';
import { WalletService } from '../../wallet/services/wallet.service.js';
import { TransactionRepository } from '../../transaction/repositories/transaction.repository.js';
import { TransactionType } from '../../transaction/entities/transaction.entity.js';

@Controller('payment/trips')
export class PaymentTripController extends BaseController {
  constructor(
    private readonly tripService: TripService,
    private readonly userService: UserService,
    private readonly walletService: WalletService,
    private readonly transactionRepository: TransactionRepository,
  ) {
    super();
  }

  @Post()
  async create(
    @Body() data: CreateTripDto,
    @Res() res: Response,
  ) {
    // If passengerId is not in body, try to get it from token
    if (!data.passengerId) {
      const userId = this.getUserId();
      if (userId) data.passengerId = userId;
    }

    if (!data.passengerId) {
      this.send(res, this.error('ID de pasajero no proporcionado.', 400), 400);
      return;
    }

    if (!data.driverId) {
      this.send(res, this.error('ID de conductor no proporcionado.', 400), 400);
      return;
    }

    if (!data.amount || data.amount <= 0) {
      this.send(res, this.error('El monto del viaje debe ser mayor a cero.', 400), 400);
      return;
    }

    console.log(`💰 [PaymentTrip] Processing trip: Passenger ${data.passengerId}, Driver ${data.driverId}, Amount ${data.amount}`);

    // 1. Get passenger UUID and check balance
    const pId = Number(data.passengerId);
    const passenger = await this.userService.findById(pId);
    if (!passenger || !passenger.passengerUuid) {
      console.error(`❌ [PaymentTrip] Passenger not found: ${pId}`);
      this.send(res, this.error('Pasajero no encontrado o sin identificador de movilidad.', 404), 404);
      return;
    }

    // 1. Get passenger balance (using userId is more reliable)
    let passengerWallet = await this.walletService.findByUserId(pId);
    
    // Fallback to passengerUuid if userId search fails (though findById already confirmed user exists)
    if (!passengerWallet && passenger.passengerUuid) {
      passengerWallet = await this.walletService.findByPassengerUuid(passenger.passengerUuid);
    }

    const currentBalance = passengerWallet ? Number(passengerWallet.balance) : 0;
    const tripAmount = Number(data.amount);
    console.log(`🏦 [PaymentTrip] Passenger ${pId} Wallet Status: ${passengerWallet ? 'Exists' : 'Not Found (Defaulting to 0)'}, Balance: ${currentBalance}, Trip Amount: ${tripAmount}`);

    if (currentBalance < tripAmount) {
      console.warn(`⚠️ [PaymentTrip] Insufficient balance for passenger ${pId}`);
      this.send(res, this.error('Saldo insuficiente.', 400), 400);
      return;
    }

    // 2. Get driver UUID for credit
    const dId = Number(data.driverId);
    const driver = await this.userService.findById(dId);
    if (!driver || !driver.driverUuid) {
      console.error(`❌ [PaymentTrip] Driver not found: ${dId}`);
      this.send(res, this.error('Conductor no encontrado o sin identificador de movilidad.', 404), 404);
      return;
    }

    // 3. Create trip
    console.log(`📝 [PaymentTrip] Creating trip record...`);
    const trip = await this.tripService.create({
      ...data,
      passengerId: pId,
      driverId: dId,
      amount: tripAmount,
    });
    console.log(`✅ [PaymentTrip] Trip created with ID: ${trip.id}`);

    // 4. Update wallets (Debit passenger, Credit driver)
    console.log(`💸 [PaymentTrip] Updating wallets: -${tripAmount} for ${pId}, +${tripAmount} for ${dId}`);
    await this.walletService.updateBalance(pId, -tripAmount);
    await this.walletService.updateBalance(dId, tripAmount);

    // 5. Record transaction for history
    console.log(`📜 [PaymentTrip] Recording transaction...`);
    await this.transactionRepository.create({
      fromId: pId,
      toId: dId,
      amount: tripAmount,
      type: TransactionType.PGM,
      reference: `TRIP-${trip.id}-${Date.now()}`,
      extras: `Pago de viaje #${trip.id} desde app movilidad`,
    });

    console.log(`🎉 [PaymentTrip] Payment completed successfully!`);
    this.send(res, this.success(trip, 'Viaje procesado y pagado exitosamente.'));
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateTripDto,
    @Res() res: Response,
  ) {
    const trip = await this.tripService.update(id, data);
    this.send(res, this.success(trip, 'Viaje actualizado.'));
  }

  @Get()
  async findAll(@Res() res: Response) {
    const trips = await this.tripService.findAll();
    this.send(res, this.success(trips, 'Historial obtenido.'));
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tripService.findById(id);
  }
}
