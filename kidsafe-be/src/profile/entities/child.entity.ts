import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity()
export class Child {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  deviceId: string;

  @Column({ default: 120 }) // Default: 2 hours in minutes
  dailyLimit: number;

  @Column('simple-array', { default: '' })
  blockedWebsites: string[];

  @Column({ default: 'avatar1.png' })
  avatar: string;

  @ManyToOne(() => User, user => user.children)
  parent: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 