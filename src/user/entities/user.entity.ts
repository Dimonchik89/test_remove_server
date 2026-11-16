import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Device } from '../../device/entities/device.entity.js';
import type { Relation } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ type: 'text' })
  hashedPassword: string;

  @Column({ nullable: true, type: 'text' })
  hashedRefreshToken: string | null;

  @Column({ default: 'FREE' })
  subscription: string;

  @Column({ nullable: true, type: 'text' })
  customerId: string | null;

  @Column({ nullable: true, type: 'text' })
  subscriptionId: string | null;

  @Column({ type: 'timestamp', nullable: true })
  subscriptionEndDate: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  subscriptionCancelScheduledAt: Date | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => Device, (device) => device.user)
  devices: Relation<Device[]>;
}
