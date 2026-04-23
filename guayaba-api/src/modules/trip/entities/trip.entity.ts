import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('trips')
export class Trip {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'boarding_lat', type: 'decimal', precision: 10, scale: 8, nullable: true })
  boardingLat!: number;

  @Column({ name: 'boarding_long', type: 'decimal', precision: 11, scale: 8, nullable: true })
  boardingLong!: number;

  @Column({ name: 'landing_lat', type: 'decimal', precision: 10, scale: 8, nullable: true })
  landingLat!: number;

  @Column({ name: 'landing_long', type: 'decimal', precision: 11, scale: 8, nullable: true })
  landingLong!: number;

  @Column({ name: 'driver_id', type: 'int', nullable: true })
  driverId!: number;

  @Column({ name: 'passenger_id', type: 'int', nullable: true })
  passengerId!: number;

  @Column({ name: 'session_id', type: 'varchar', length: 255, nullable: true })
  sessionId!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  amount!: number;

  @Column({ name: 'passenger_count', type: 'int', default: 1 })
  passengerCount!: number;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ name: 'direction_from', type: 'text', nullable: true })
  directionFrom!: string;

  @Column({ name: 'direction_to', type: 'text', nullable: true })
  directionTo!: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  status!: string;

  @Column({ name: 'boarded_at', type: 'timestamp', nullable: true })
  boardedAt!: Date;

  @Column({ name: 'landed_at', type: 'timestamp', nullable: true })
  landedAt!: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}

