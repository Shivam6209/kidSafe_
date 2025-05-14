import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Child } from '../../profile/entities/child.entity';

@Entity()
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // App or website name

  @Column({ nullable: true })
  category: string; // e.g., 'social-media', 'education', 'entertainment', 'gaming'

  @Column()
  duration: number; // Duration in minutes

  @Column({ nullable: true })
  url: string;

  @CreateDateColumn()
  timestamp: Date;

  @ManyToOne(() => Child)
  child: Child;
} 