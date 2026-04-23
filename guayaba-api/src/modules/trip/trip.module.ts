import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from './entities/trip.entity.js';
import { TripRepository } from './repositories/trip.repository.js';
import { TripService } from './services/trip.service.js';
import { TripController } from './controllers/trip.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Trip])],
  controllers: [TripController],
  providers: [TripRepository, TripService],
  exports: [TripService, TripRepository],
})
export class TripModule { }
