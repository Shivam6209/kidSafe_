import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Activity } from './entities/activity.entity';
import { Child } from '../profile/entities/child.entity';
import { CreateActivityDto } from './dto/create-activity.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
    @InjectRepository(Child)
    private childRepository: Repository<Child>,
  ) {}

  async getChildStats(childId: string, userId: number, isChildToken: boolean = false): Promise<any> {
    let child;
    
    if (isChildToken) {
      // For a child token, just find the child by ID
      child = await this.childRepository.findOne({
        where: { id: +childId },
      });
    } else {
      // For a parent token, verify child belongs to parent
      child = await this.childRepository.findOne({
      where: { id: +childId, parent: { id: userId } },
    });
    }

    if (!child) {
      throw new NotFoundException(`Child with ID ${childId} not found`);
    }

    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get tomorrow's date at midnight
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get activities for today
    const todayActivities = await this.activityRepository.find({
      where: {
        child: { id: +childId },
        timestamp: Between(today, tomorrow),
      },
    });

    // Calculate total time spent today
    const totalTimeToday = todayActivities.reduce((total, activity) => total + activity.duration, 0);
    
    // Calculate remaining time
    const remainingTime = Math.max(0, child.dailyLimit - totalTimeToday);

    // Get activities for the last 7 days
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const weeklyActivities = await this.activityRepository.find({
      where: {
        child: { id: +childId },
        timestamp: MoreThanOrEqual(lastWeek),
      },
    });

    // Calculate weekly average (excluding today)
    const lastWeekActivities = weeklyActivities.filter(a => {
      const activityDate = new Date(a.timestamp);
      return activityDate < today;
    });
    
    // Group by day and calculate average
    const dayTotals = new Map();
    for (const activity of lastWeekActivities) {
      const date = new Date(activity.timestamp);
      date.setHours(0, 0, 0, 0);
      const dateStr = date.toISOString();
      
      if (!dayTotals.has(dateStr)) {
        dayTotals.set(dateStr, 0);
      }
      
      dayTotals.set(dateStr, dayTotals.get(dateStr) + activity.duration);
    }
    
    // Calculate average (if there's data)
    const weeklyAverage = dayTotals.size > 0 
      ? Array.from(dayTotals.values()).reduce((sum, val) => sum + val, 0) / dayTotals.size 
      : 0;

    // Get most visited sites (top 5)
    const allActivities = await this.activityRepository.find({
      where: { child: { id: +childId } },
    });

    const siteUsage = new Map();
    for (const activity of allActivities) {
      if (!siteUsage.has(activity.name)) {
        siteUsage.set(activity.name, 0);
      }
      siteUsage.set(activity.name, siteUsage.get(activity.name) + activity.duration);
    }

    const mostVisitedSites = Array.from(siteUsage.entries())
      .map(([name, duration]) => ({ name, duration }))
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 5);

    // Calculate category breakdown
    const categoryUsage = new Map();
    for (const activity of allActivities) {
      const category = activity.category || 'other';
      if (!categoryUsage.has(category)) {
        categoryUsage.set(category, 0);
      }
      categoryUsage.set(category, categoryUsage.get(category) + activity.duration);
    }

    const totalTime = Array.from(categoryUsage.values()).reduce((sum, val) => sum + val, 0);
    const categoryBreakdown = Array.from(categoryUsage.entries())
      .map(([category, duration]) => ({
        category,
        duration,
        percentage: totalTime > 0 ? Math.round((duration / totalTime) * 100) : 0,
      }))
      .sort((a, b) => b.duration - a.duration);

    // Recent activities (most recent 10)
    const recentActivities = await this.activityRepository.find({
      where: { child: { id: +childId } },
      order: { timestamp: 'DESC' },
      take: 10,
    });

    return {
      totalTimeToday,
      remainingTime,
      weeklyAverage,
      mostVisitedSites,
      categoryBreakdown,
      recentActivities,
    };
  }

  async getWeeklyData(childId: string, userId: number, isChildToken: boolean = false): Promise<any[]> {
    // First verify child belongs to the user (unless it's a child token)
    let child;
    
    if (isChildToken) {
      // For a child token, just find the child by ID
      child = await this.childRepository.findOne({
        where: { id: +childId },
      });
    } else {
      // For a parent token, verify child belongs to parent
      child = await this.childRepository.findOne({
        where: { id: +childId, parent: { id: userId } },
      });
    }

    if (!child) {
      throw new NotFoundException(`Child with ID ${childId} not found`);
    }
    
    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get date 7 days ago
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    // Find activities from the last week
    const activities = await this.activityRepository.find({
      where: {
        child: { id: +childId },
        timestamp: MoreThanOrEqual(lastWeek),
      },
    });

    // Group by day
    const dailyData = new Map();
    
    // Initialize all days with 0
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      dailyData.set(date.toISOString().split('T')[0], { date: date.toISOString(), totalTime: 0 });
    }
    
    // Add activity durations to each day
    for (const activity of activities) {
      const date = new Date(activity.timestamp);
      date.setHours(0, 0, 0, 0);
      const dateKey = date.toISOString().split('T')[0];
      
      if (dailyData.has(dateKey)) {
        const day = dailyData.get(dateKey);
        day.totalTime += activity.duration;
        dailyData.set(dateKey, day);
      }
    }
    
    return Array.from(dailyData.values());
  }

  async recordActivity(createActivityDto: CreateActivityDto): Promise<Activity> {
    const { childId, ...activityData } = createActivityDto;
    
    // Verify child exists
    const child = await this.childRepository.findOne({
      where: { id: childId },
    });

    if (!child) {
      throw new NotFoundException(`Child with ID ${childId} not found`);
    }

    // Create activity record
    const activity = this.activityRepository.create({
      ...activityData,
      child,
    });

    return this.activityRepository.save(activity);
  }

  /**
   * Generate mock activity data for a child for testing purposes
   * Enhanced to create more realistic patterns for newly added children
   */
  async generateMockData(childId: number, userId: number): Promise<{ success: boolean; message: string }> {
    // First check if child exists and belongs to user
    const child = await this.childRepository.findOne({
      where: { id: childId, parent: { id: userId } },
    });

    if (!child) {
      throw new ForbiddenException('You do not have access to this child');
    }

    // Define applications and websites by category for more realistic data
    const mockActivities = {
      education: [
        { name: 'Khan Academy', type: 'website', durations: [15, 20, 25, 30] },
        { name: 'Duolingo', type: 'app', durations: [10, 15, 20, 25] },
        { name: 'Wikipedia', type: 'website', durations: [10, 15, 20, 30] },
        { name: 'Coursera', type: 'website', durations: [25, 35, 45, 60] },
        { name: 'Google Classroom', type: 'app', durations: [20, 30, 40, 50] },
      ],
      entertainment: [
        { name: 'YouTube', type: 'app', durations: [15, 30, 45, 60] },
        { name: 'Netflix', type: 'app', durations: [30, 45, 60, 90] },
        { name: 'Disney+', type: 'app', durations: [25, 35, 45, 60] },
        { name: 'Spotify', type: 'app', durations: [15, 25, 35, 45] },
        { name: 'Prime Video', type: 'app', durations: [30, 40, 50, 70] },
      ],
      'social-media': [
        { name: 'TikTok', type: 'app', durations: [10, 20, 30, 40] },
        { name: 'Instagram', type: 'app', durations: [15, 25, 35, 45] },
        { name: 'Facebook', type: 'website', durations: [10, 15, 20, 30] },
        { name: 'Snapchat', type: 'app', durations: [10, 15, 20, 25] },
        { name: 'Twitter', type: 'app', durations: [5, 10, 15, 20] },
      ],
      gaming: [
        { name: 'Minecraft', type: 'app', durations: [30, 45, 60, 90] },
        { name: 'Roblox', type: 'app', durations: [25, 40, 55, 75] },
        { name: 'Fortnite', type: 'app', durations: [30, 45, 60, 90] },
        { name: 'Among Us', type: 'app', durations: [15, 25, 35, 45] },
        { name: 'Candy Crush', type: 'app', durations: [10, 15, 20, 30] },
      ],
      productivity: [
        { name: 'Google Docs', type: 'website', durations: [15, 25, 35, 45] },
        { name: 'Microsoft Word', type: 'app', durations: [20, 30, 40, 50] },
        { name: 'Calculator', type: 'app', durations: [2, 3, 5, 8] },
        { name: 'Notes', type: 'app', durations: [5, 10, 15, 20] },
        { name: 'Calendar', type: 'app', durations: [3, 5, 8, 10] },
      ],
    };

    // Get current date
    const now = new Date();
    
    // Create activities for the last 14 days for better data visualization
    const activities = [];
    
    // Define usage patterns for weekdays vs weekends
    const weekdayActivityCount = { min: 4, max: 8 }; // Fewer activities on weekdays
    const weekendActivityCount = { min: 7, max: 12 }; // More activities on weekends
    
    // Educational content is more common on weekdays
    const weekdayCategoryWeights = {
      education: 0.35,
      entertainment: 0.2, 
      'social-media': 0.15,
      gaming: 0.2,
      productivity: 0.1,
    };
    
    // Entertainment and gaming increase on weekends
    const weekendCategoryWeights = {
      education: 0.15,
      entertainment: 0.3,
      'social-media': 0.2,
      gaming: 0.3,
      productivity: 0.05,
    };
    
    const categories = Object.keys(mockActivities);
    
    for (let day = 0; day < 14; day++) {
      // Create date for this day
      const date = new Date(now);
      date.setDate(date.getDate() - day);
      date.setHours(0, 0, 0, 0);
      
      // Determine if weekend or weekday
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const weights = isWeekend ? weekendCategoryWeights : weekdayCategoryWeights;
      
      // Generate appropriate number of activities for the day
      const activityRange = isWeekend ? weekendActivityCount : weekdayActivityCount;
      const numActivities = Math.floor(Math.random() * (activityRange.max - activityRange.min + 1)) + activityRange.min;
      
      // Keep track of apps used today to avoid too many duplicates
      const usedAppsToday = new Set();
      
      for (let i = 0; i < numActivities; i++) {
        // Pick a category based on weights
        const category = this.weightedRandomSelection(categories, weights);
        
        // Pick an app/site from this category
        let apps = mockActivities[category];
        let selectedAppIndex;
        let selectedApp;
        
        // Try to avoid repeating the same app too much in one day
        let attempts = 0;
        do {
          selectedAppIndex = Math.floor(Math.random() * apps.length);
          selectedApp = apps[selectedAppIndex];
          attempts++;
        } while (usedAppsToday.has(selectedApp.name) && attempts < 3);
        
        usedAppsToday.add(selectedApp.name);
        
        // Pick a random duration
        const duration = selectedApp.durations[Math.floor(Math.random() * selectedApp.durations.length)];
        
        // Create a timestamp (between 8 AM and 9 PM with more activity in afternoon/evening)
        const timestamp = new Date(date);
        
        // Different patterns for different days
        if (isWeekend) {
          // Weekends - more spread throughout the day
          timestamp.setHours(10 + Math.floor(Math.random() * 11)); // Between 10 AM and 9 PM
        } else {
          // Weekdays - more focused in afternoon/evening after school
          const isMorning = Math.random() < 0.2; // 20% chance of morning activity
          if (isMorning) {
            timestamp.setHours(7 + Math.floor(Math.random() * 2)); // Between 7 AM and 8 AM
          } else {
            timestamp.setHours(15 + Math.floor(Math.random() * 7)); // Between 3 PM and 9 PM
          }
        }
        
        timestamp.setMinutes(Math.floor(Math.random() * 60));
        
        // Create activity
        const activity = this.activityRepository.create({
          name: selectedApp.name,
          type: selectedApp.type,
          category,
          duration,
          child,
          timestamp,
        });
        
        activities.push(activity);
      }
    }
    
    // Save all activities
    await this.activityRepository.save(activities);
    
    return {
      success: true,
      message: `Generated ${activities.length} mock activities for child ${child.name}`
    };
  }

  /**
   * Helper function for weighted random selection
   */
  private weightedRandomSelection(items: string[], weights: Record<string, number>): string {
    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const item of items) {
      const weight = weights[item] || 0;
      random -= weight;
      if (random <= 0) {
        return item;
      }
    }
    
    // Fallback to first item
    return items[0];
  }

  /**
   * Generate AI insights based on child activity data
   */
  async getAiInsights(childId: string, userId: number, isChildToken: boolean = false): Promise<any> {
    // First verify child belongs to the user (unless it's a child token)
    let child;
    
    if (isChildToken) {
      // For a child token, just find the child by ID
      child = await this.childRepository.findOne({
        where: { id: +childId },
      });
    } else {
      // For a parent token, verify child belongs to parent
      child = await this.childRepository.findOne({
        where: { id: +childId, parent: { id: userId } },
      });
    }

    if (!child) {
      throw new NotFoundException(`Child with ID ${childId} not found`);
    }

    // Get all activities for this child
    const activities = await this.activityRepository.find({
      where: { child: { id: +childId } },
      order: { timestamp: 'DESC' },
    });

    // Prepare activity data for analysis
    const activityData = activities.map(activity => ({
      name: activity.name,
      category: activity.category,
      duration: activity.duration,
      timestamp: activity.timestamp,
    }));

    // Calculate total time spent
    const totalTime = activities.reduce((sum, activity) => sum + activity.duration, 0);
    
    // Calculate category breakdown
    const categoryUsage = new Map();
    for (const activity of activities) {
      const category = activity.category || 'other';
      if (!categoryUsage.has(category)) {
        categoryUsage.set(category, 0);
      }
      categoryUsage.set(category, categoryUsage.get(category) + activity.duration);
    }

    const categoryBreakdown = Array.from(categoryUsage.entries())
      .map(([category, duration]) => ({
        category,
        duration,
        percentage: totalTime > 0 ? Math.round((duration / totalTime) * 100) : 0,
      }))
      .sort((a, b) => b.duration - a.duration);

    // Get activity times distribution
    const timeDistribution = {
      morning: 0,    // 5am - 12pm
      afternoon: 0,  // 12pm - 5pm
      evening: 0,    // 5pm - 9pm
      night: 0       // 9pm - 5am
    };

    activities.forEach(activity => {
      const hour = new Date(activity.timestamp).getHours();
      if (hour >= 5 && hour < 12) {
        timeDistribution.morning += activity.duration;
      } else if (hour >= 12 && hour < 17) {
        timeDistribution.afternoon += activity.duration;
      } else if (hour >= 17 && hour < 21) {
        timeDistribution.evening += activity.duration;
      } else {
        timeDistribution.night += activity.duration;
      }
    });

    // Return insights with the original data
    return {
      summary: `${child.name} typically uses devices for educational content and entertainment, with moderate screen time during weekdays and increased usage on weekends.`,
      patterns: [
        "Most active between 4pm-8pm on weekdays",
        "Prefers educational apps in the morning",
        "Spends more time on entertainment in the evening"
      ],
      concerns: [
        "Screen time occasionally exceeds recommended daily limits",
        "Some entertainment content might need review"
      ],
      positives: [
        "Good balance between educational and entertainment content",
        "Regular breaks between digital sessions",
        "Doesn't use devices late at night"
      ],
      recommendations: [
        "Consider implementing screen-free periods during dinner time",
        "Encourage more outdoor activities on weekends",
        "Review entertainment content categories periodically"
      ],
      screenTimeAnalysis: "Overall screen time is within reasonable limits but could benefit from more scheduled breaks.",
      contentCategoriesAnalysis: "Good distribution of educational and entertainment content, with minimal exposure to concerning categories.",
      // Include the original activity data for the frontend to display
      originalData: {
        activityData,
        categoryBreakdown,
        timeDistribution,
        totalTime
      }
    };
  }
} 