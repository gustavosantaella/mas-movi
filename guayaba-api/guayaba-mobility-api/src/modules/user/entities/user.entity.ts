import { Entity, PrimaryGeneratedColumn, Column, Generated } from 'typeorm';



@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({nullable: true})
  firstName!: string;

  @Column({nullable: true})
  lastName!: string;

  @Column({nullable: true})
  dateOfBirth!: string;

  @Column({nullable: true})
  sex!: string;

  @Column({ default: false, nullable: true })
  emailConfirmed!: boolean;

  @Column({ unique: true })
  email!: string;

  @Column({ unique: true, nullable: true })
  phoneNumber!: string;

  @Column()
  password!: string;

  @Column({nullable: true})
  dni!: string;


  // 1: Admin, 2: Passenger, 3: Driver
  @Column({ type: 'int', array: true })
  userType!: number[];

  @Column({ type: 'uuid', unique: true, nullable: true })
  @Generated('uuid')
  passengerUuid!: string;

  @Column({ type: 'uuid', unique: true, nullable: true })
  @Generated('uuid')
  driverUuid!: string;

  @Column({ type: 'timestamp', default: () => 'NOW()', nullable: true })
  createdAt!: Date;


  // 1- Active
  // 2- Inactive
  // 3- locked
  // 4- suspended
  @Column({ default: 1, nullable: true, type: 'int' })
  status!: number;


  @Column({ default: false, type: 'bool' })
  entityConfirmed!: boolean;
}

