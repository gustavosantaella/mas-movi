import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
} from 'typeorm';

export enum TransactionType {
  RECHARGE = 'recharge',
  PGM = 'pgm',
  TRANSFER = 'transfer',
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'uuid' })
  @Generated('uuid')
  uuid!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  reference!: string | null;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  tax!: number | null;

  @Column({ name: 'from_id', type: 'int', nullable: true })
  fromId!: number | null;

  @Column({ name: 'to_id', type: 'int', nullable: true })
  toId!: number | null;

  @Column({ type: 'varchar', length: 50 })
  type!: TransactionType;

  @Column({ name: 'from_bank', type: 'varchar', length: 255, nullable: true })
  fromBank!: string | null;

  @Column({ type: 'text', nullable: true })
  extras!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
