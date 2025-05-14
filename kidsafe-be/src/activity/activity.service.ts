import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Activity } from './entities/activity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { NotificationService } from '../shared/notification.service';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
    private notificationService: NotificationService,
  ) {}

  /**
   * Create a new activity record
   */
  async createActivity(createActivityDto: CreateActivityDto): Promise<Activity> {
    // Create activity record
    const activity = this.activityRepository.create(createActivityDto);
    
    // Save to database
    const savedActivity = await this.activityRepository.save(activity);
    
    // If activity is restricted or blocked, send notification to parent
    if (activity.isRestricted || activity.isBlocked) {
      try {
        // Get parent email from child repository
        // For this example, we're simplifying by not doing the actual lookup
        // In a real implementation, you would retrieve the parent from the database
        const parentEmail = 'parent@example.com'; // This would be retrieved from DB
        const childName = 'Child'; // This would be retrieved from DB
        
        await this.notificationService.sendRestrictedContentAlert(
          parentEmail,
          activity.childId,
          childName,
          activity.type
        );
      } catch (error) {
        // Log error but don't fail the request
        console.error('Failed to send notification:', error);
      }
    }
    
    return savedActivity;
  }

  /**
   * Create multiple activity records in a batch
   */
  async createActivitiesBatch(activitiesDto: CreateActivityDto[]): Promise<Activity[]> {
    if (!activitiesDto || activitiesDto.length === 0) {
      return [];
    }
    
    // Create activity entities
    const activities = activitiesDto.map(dto => this.activityRepository.create(dto));
    
    // Save all activities in a batch
    const savedActivities = await this.activityRepository.save(activities);
    
    // Check for restricted/blocked activities and send notifications
    const restrictedActivities = activities.filter(activity => 
      activity.isRestricted || activity.isBlocked
    );
    
    if (restrictedActivities.length > 0) {
      try {
        // For simplicity, just send one notification for all restricted activities
        // In a real implementation, you might want to be more specific or group by child
        const parentEmail = 'parent@example.com'; // This would be retrieved from DB
        const childName = 'Child'; // This would be retrieved from DB
        
        await this.notificationService.sendRestrictedContentAlert(
          parentEmail,
          restrictedActivities[0].childId,
          childName,
          `multiple activities (${restrictedActivities.length})`
        );
      } catch (error) {
        console.error('Failed to send notification:', error);
      }
    }
    
    return savedActivities;
  }

  /**
   * Get activities for a specific child
   */
  async getActivities(
    childId: number, 
    userId: number,
    startDate?: Date,
    endDate?: Date,
    type?: string,
    category?: string,
  ): Promise<Activity[]> {
    // Build query conditions
    const whereConditions: any = { childId };
    
    if (startDate || endDate) {
      whereConditions.createdAt = {};
      
      if (startDate) {
        whereConditions.createdAt = { 
          ...whereConditions.createdAt,
          gte: startDate 
        };
      }
      
      if (endDate) {
        whereConditions.createdAt = { 
          ...whereConditions.createdAt,
          lte: endDate 
        };
      }
    }
    
    if (type) {
      whereConditions.type = type;
    }
    
    if (category) {
      whereConditions.category = category;
    }

    // Find activities with conditions
    return this.activityRepository.find({
      where: whereConditions,
      order: { createdAt: 'DESC' }
    });
  }

  /**
   * Get a summary of activities by type
   */
  async getActivitySummary(childId: number, userId: number): Promise<any> {
    // Get all activities for this child
    const activities = await this.getActivities(childId, userId);
    
    // Calculate totals by type
    const typeMap = new Map<string, number>();
    const categoryMap = new Map<string, number>();
    
    for (const activity of activities) {
      // Add to type totals
      const typeTotal = typeMap.get(activity.type) || 0;
      typeMap.set(activity.type, typeTotal + activity.duration);
      
      // Add to category totals
      if (activity.category) {
        const categoryTotal = categoryMap.get(activity.category) || 0;
        categoryMap.set(activity.category, categoryTotal + activity.duration);
      }
    }
    
    // Convert maps to arrays
    const typeData = Array.from(typeMap.entries()).map(([type, duration]) => ({
      type,
      duration,
    }));
    
    const categoryData = Array.from(categoryMap.entries()).map(([category, duration]) => ({
      category,
      duration,
    }));
    
    return {
      totalActivities: activities.length,
      totalDuration: activities.reduce((total, a) => total + a.duration, 0),
      byType: typeData,
      byCategory: categoryData,
    };
  }

  /**
   * Get a time series of activity data for visualization
   */
  async getActivityTimeSeries(
    childId: number, 
    userId: number,
    days: number = 7
  ): Promise<any> {
    // Calculate start date (n days ago)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Get activities in date range
    const activities = await this.getActivities(
      childId,
      userId,
      startDate,
      endDate
    );
    
    // Group by day
    const dailyData = [];
    
    for (let i = 0; i <= days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Find activities for this day
      const dayActivities = activities.filter(a => {
        const activityDate = new Date(a.createdAt);
        return activityDate.toISOString().split('T')[0] === dateStr;
      });
      
      dailyData.push({
        date: dateStr,
        count: dayActivities.length,
        duration: dayActivities.reduce((total, a) => total + a.duration, 0),
      });
    }
    
    return dailyData;
  }
} 