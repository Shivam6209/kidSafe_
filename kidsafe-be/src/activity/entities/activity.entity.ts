import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  childId: number;
  
  @Column()
  type: string; // app, website, game, etc.
  
  @Column()
  name: string; // name of the app, website, etc.
  
  @Column({ nullable: true })
  url?: string; // for websites
  
  @Column({ nullable: true })
  category?: string; // category of the activity
  
  @Column({ default: 0 })
  duration: number; // in seconds
  
  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>; // any additional metadata
  
  @Column({ default: false })
  isRestricted: boolean; // whether this activity is restricted
  
  @Column({ default: false })
  isBlocked: boolean; // whether access was blocked
  
  @CreateDateColumn()
  createdAt: Date;
  
  @Column({ type: 'timestamp', nullable: true })
  endedAt?: Date;
} 