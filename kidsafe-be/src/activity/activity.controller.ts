import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { Activity } from './entities/activity.entity';

@Controller('activity')
@UseGuards(AuthGuard('jwt'))
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post()
  async createActivity(@Body() createActivityDto: CreateActivityDto): Promise<Activity> {
    return this.activityService.createActivity(createActivityDto);
  }

  @Post('batch')
  async createActivitiesBatch(@Body() payload: { activities: CreateActivityDto[] }): Promise<{ success: boolean; count: number }> {
    const results = await this.activityService.createActivitiesBatch(payload.activities);
    return { 
      success: true, 
      count: results.length 
    };
  }

  @Get('child/:childId')
  async getActivities(
    @Param('childId') childId: string,
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('type') type?: string,
    @Query('category') category?: string,
  ): Promise<Activity[]> {
    const userId = req.user.userId || req.user.id;
    
    // Parse dates if provided
    const startDateObj = startDate ? new Date(startDate) : undefined;
    const endDateObj = endDate ? new Date(endDate) : undefined;
    
    return this.activityService.getActivities(
      +childId,
      userId,
      startDateObj,
      endDateObj,
      type,
      category
    );
  }

  @Get('child/:childId/summary')
  async getActivitySummary(
    @Param('childId') childId: string,
    @Request() req
  ): Promise<any> {
    const userId = req.user.userId || req.user.id;
    return this.activityService.getActivitySummary(+childId, userId);
  }

  @Get('child/:childId/time-series')
  async getActivityTimeSeries(
    @Param('childId') childId: string,
    @Request() req,
    @Query('days') days?: string
  ): Promise<any> {
    const userId = req.user.userId || req.user.id;
    const daysNum = days ? parseInt(days, 10) : 7;
    return this.activityService.getActivityTimeSeries(+childId, userId, daysNum);
  }
} 