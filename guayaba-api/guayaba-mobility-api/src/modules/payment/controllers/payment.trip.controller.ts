import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Res,
  Headers,
} from '@nestjs/common';
import type { Response } from 'express';
import { BaseController } from '../../../core/base.controller.js';
import { TripService } from '../../../modules/trip/services/trip.service';
import { CreateTripDto, UpdateTripDto } from '../../../modules/trip/controllers/models/trip.dto.js';
import { UserService } from '../../../modules/user/services/user.service';
import { WalletService } from '../../../modules/wallet/services/wallet.service';

@Controller('payment/trips')
export class PaymentTripController extends BaseController {
  constructor(
    private readonly tripService: TripService,
    private readonly userService: UserService,
    private readonly walletService: WalletService,
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

    // 1. Get passenger UUID and check balance
    const passenger = await this.userService.findById(data.passengerId!);
    if (!passenger || !passenger.passengerUuid) {
      this.send(res, this.error('Pasajero no encontrado o sin identificador de movilidad.', 404), 404);
      return;
    }

    const passengerWallet = await this.walletService.findByPassengerUuid(passenger.passengerUuid);
    if (!passengerWallet) {
      this.send(res, this.error('Billetera del pasajero no encontrada.', 404), 404);
      return;
    }

    if (Number(passengerWallet.balance) < data.amount!) {
      this.send(res, this.error('Saldo insuficiente.', 400), 400);
      return;
    }

    // 2. Get driver UUID for credit
    const driver = await this.userService.findById(data.driverId!);

    if (!driver || !driver.driverUuid) {
      this.send(res, this.error('Conductor no encontrado o sin identificador de movilidad.', 404), 404);
      return;
    }

    // 3. Create trip
    const trip = await this.tripService.create(data);

    // 4. Update wallets (Debit passenger, Credit driver)
    // Using userId for update balance which uses .increment (positive to add, negative to subtract)
    await this.walletService.updateBalance(passenger.id, -data.amount!);
    await this.walletService.updateBalance(driver.id, data.amount!);

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
