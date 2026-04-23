import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity.js';

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  balance: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  balanceLocked: number;

  @Column({ type: 'uuid', nullable: true })
  passengerUuid: string | null;

  @Column({ type: 'uuid', nullable: true })
  driverUuid: string | null;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'passengerUuid', referencedColumnName: 'passengerUuid' })
  passenger: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'driverUuid', referencedColumnName: 'driverUuid' })
  driver: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
