import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  ParseIntPipe,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { BaseController } from "@/core/base.controller.js";
import { TripService } from "@/modules/trip/services/trip.service";
import { CreateTripDto, UpdateTripDto } from "./models/trip.dto.js";

@Controller('trips')
export class TripController extends BaseController {
  constructor(private readonly tripService: TripService) {
    super();
  }

  @Get('history')
  async getHistory(
    @Query('role') role: string,
    @Res() res: Response
  ) {
    const userId = this.getUserId();
    if (!userId) {
      return this.send(res, this.error('No autorizado.', 401), 401);
    }

    let trips;
    if (role === 'driver') {
      trips = await this.tripService.findByDriverId(userId);
    } else {
      // Default to passenger
      trips = await this.tripService.findByPassengerId(userId);
    }

    this.send(res, this.success(trips, 'Historial de viajes obtenido.'));
  }

  @Get()
  async findAll(@Res() res: Response) {
    const trips = await this.tripService.findAll();
    this.send(res, this.success(trips, 'Historial de viajes.'));
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const trip = await this.tripService.findById(id);
    this.send(res, this.success(trip, 'Detalle del viaje.'));
  }

  @Post()
  async create(@Body() data: CreateTripDto, @Res() res: Response) {
    const trip = await this.tripService.create(data);
    this.send(res, this.success(trip, 'Viaje creado exitosamente.'));
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
}

