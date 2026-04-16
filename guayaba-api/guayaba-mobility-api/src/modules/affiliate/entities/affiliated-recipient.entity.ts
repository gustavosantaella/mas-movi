import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('affiliated_recipients')
@Index(['ownerId', 'recipientId'], { unique: true })
export class AffiliatedRecipient {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'owner_id', type: 'int' })
  ownerId!: number;

  @Column({ name: 'recipient_id', type: 'int' })
  recipientId!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  alias!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
