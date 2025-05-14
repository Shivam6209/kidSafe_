import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getChildStats(childId: string, userId: number): Promise<any> {
    // First verify child belongs to the user
    const child = await this.childRepository.findOne({
      where: { id: +childId, parent: { id: userId } },
    });

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

    // Generate some AI insights (simulated for now)
    const aiInsights = [
      "Screen time is 15% higher on weekends compared to weekdays.",
      "Educational content makes up only 25% of total screen time.",
      "YouTube usage has increased by 10% in the last week.",
      "Most active hours are between 3PM and 6PM.",
      "Consider setting stricter limits for gaming apps which account for 40% of usage."
    ];

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
      aiInsights,
      recentActivities,
    };
  }

  async getWeeklyData(childId: string): Promise<any[]> {
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
} 