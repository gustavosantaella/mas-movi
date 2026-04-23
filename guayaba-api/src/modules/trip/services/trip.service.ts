import { Injectable } from '@nestjs/common';
import { TripRepository } from '../repositories/trip.repository.js';
import { TripDao } from '../repositories/models/trip.dao.js';
import { CreateTripDto, UpdateTripDto } from '../controllers/models/trip.dto.js';

@Injectable()
export class TripService {
  constructor(private readonly tripRepository: TripRepository) { }

  async findAll(): Promise<TripDao[]> {
    return this.tripRepository.findAll();
  }

  async findByPassengerId(passengerId: number): Promise<TripDao[]> {
    return this.tripRepository.findByPassengerId(passengerId);
  }

  async findByDriverId(driverId: number): Promise<TripDao[]> {
    return this.tripRepository.findByDriverId(driverId);
  }

  async findById(id: number): Promise<TripDao | null> {
    return this.tripRepository.findById(id);
  }

  async create(dto: CreateTripDto): Promise<TripDao> {
    return this.tripRepository.create(dto);
  }

  async update(id: number, dto: UpdateTripDto): Promise<TripDao | null> {
    return this.tripRepository.update(id, dto);
  }
}
