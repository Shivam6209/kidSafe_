import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Child } from './entities/child.entity';
import { User } from '../auth/entities/user.entity';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import { NotificationService } from '../shared/notification.service';
import { DashboardService } from '../dashboard/dashboard.service';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Child)
    private childRepository: Repository<Child>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private notificationService: NotificationService,
    private dashboardService: DashboardService,
    private moduleRef: ModuleRef,
  ) {}

  async getChildren(userId: number): Promise<Child[]> {
    return this.childRepository.find({
      where: { parent: { id: userId } },
    });
  }

  async getChild(id: number, userId: number): Promise<Child> {
    const child = await this.childRepository.findOne({
      where: { id, parent: { id: userId } },
    });

    if (!child) {
      throw new NotFoundException(`Child with ID ${id} not found`);
    }

    return child;
  }

  async createChild(userId: number, createChildDto: CreateChildDto): Promise<Child> {
    // Check if parent exists
    const parent = await this.userRepository.findOne({
      where: { id: userId }
    });

    if (!parent) {
      throw new NotFoundException('Parent not found');
    }

    // Generate device ID if not provided
    const deviceId = createChildDto.deviceId || `device-${uuidv4().substring(0, 8)}`;

    // Check if device ID is already in use
    const existingChild = await this.childRepository.findOne({ where: { deviceId } });
    if (existingChild) {
      throw new ConflictException(`Device ID ${deviceId} is already in use`);
    }

    // Create child object
    const child = this.childRepository.create({
      ...createChildDto,
      deviceId,
      parent
    });

    // Save child
    const savedChild = await this.childRepository.save(child);

    // Generate initial activity data
    this.generateInitialChildActivities(savedChild.id);

    return savedChild;
  }

  async updateChild(id: number, userId: number, updateChildDto: UpdateChildDto): Promise<Child> {
    // First check if child exists and belongs to user
    const child = await this.getChild(id, userId);

    // If updating device ID, check if it's already in use
    if (updateChildDto.deviceId) {
      const existingChild = await this.childRepository.findOne({ 
        where: { deviceId: updateChildDto.deviceId }
      });
      
      if (existingChild && existingChild.id !== id) {
        throw new ConflictException(`Device ID ${updateChildDto.deviceId} is already in use`);
      }
    }

    // Update the child
    Object.assign(child, updateChildDto);
    return this.childRepository.save(child);
  }

  async deleteChild(id: number, userId: number): Promise<void> {
    // First check if child exists and belongs to user
    const child = await this.getChild(id, userId);

    await this.childRepository.remove(child);
  }

  /**
   * Register a device token for push notifications
   */
  async registerDeviceToken(childId: number, userId: number, deviceToken: string): Promise<{ success: boolean }> {
    // First check if child exists and belongs to user
    const child = await this.getChild(childId, userId);
    
    if (!child) {
      throw new ForbiddenException('You do not have access to this child');
    }
    
    // Register the token with the notification service
    const success = this.notificationService.registerDeviceToken(childId, deviceToken);
    
    return { success };
  }

  /**
   * Generate starter mock data for a newly added child
   */
  async generateInitialChildActivities(childId: number): Promise<void> {
    try {
      // Get the dashboard service to use its generateMockData method
      // In a real app, you would use dependency injection, but for simplicity
      // we'll assume a dashboard service instance is available
      const dashboardService = this.moduleRef.get(DashboardService, { strict: false });
      if (dashboardService && dashboardService.generateMockData) {
        // The parent ID is needed for the generateMockData method
        const child = await this.childRepository.findOne({
          where: { id: childId },
          relations: ['parent'],
        });
        
        if (child && child.parent) {
          await dashboardService.generateMockData(childId, child.parent.id);
          console.log(`Generated initial activity data for child ID: ${childId}`);
        }
      }
    } catch (error) {
      // Log error but don't fail the child creation
      console.error(`Failed to generate initial activity data for child ID: ${childId}`, error);
    }
  }
} 