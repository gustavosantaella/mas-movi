import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip } from '../../../modules/trip/entities/trip.entity.js';
import { TripDao } from './models/trip.dao.js';

@Injectable()
export class TripRepository {
  constructor(
    @InjectRepository(Trip)
    private readonly repo: Repository<Trip>,
  ) {}

  async findByPassengerId(passengerId: number, limit = 10): Promise<TripDao[]> {
    const trips = await this.repo.find({
      where: { passengerId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
    return trips.map(trip => this.toDao(trip));
  }

  async findByDriverId(driverId: number, limit = 10): Promise<TripDao[]> {
    const trips = await this.repo.find({
      where: { driverId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
    return trips.map(trip => this.toDao(trip));
  }

  async findAll(): Promise<TripDao[]> {
    const trips = await this.repo.find({
      order: { createdAt: 'DESC' },
    });
    return trips.map(trip => this.toDao(trip));
  }

  async findById(id: number): Promise<TripDao | null> {
    const trip = await this.repo.findOne({ where: { id } });
    return trip ? this.toDao(trip) : null;
  }

  async create(data: Partial<Trip>): Promise<TripDao> {
    const trip = this.repo.create(data);
    const savedTrip = await this.repo.save(trip);
    return this.toDao(savedTrip);
  }

  async update(id: number, data: Partial<Trip>): Promise<TripDao | null> {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  private toDao(trip: Trip): TripDao {
    const { ...dao } = trip;
    return dao as TripDao;
  }
}
