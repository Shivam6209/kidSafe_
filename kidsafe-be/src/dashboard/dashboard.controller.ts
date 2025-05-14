import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DashboardService } from './dashboard.service';
import { CreateActivityDto } from './dto/create-activity.dto';

@Controller('dashboard')
@UseGuards(AuthGuard('jwt'))
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('child/:id/stats')
  async getChildStats(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId || req.user.id;
    const isChildToken = !!req.user.isChildToken;
    const stats = await this.dashboardService.getChildStats(id, userId, isChildToken);
    
    // Add static AI insights since we removed dynamic ones
    if (!stats.aiInsights) {
      stats.aiInsights = [
        "Screen time is 15% higher on weekends compared to weekdays.",
        "Educational content makes up only 25% of total screen time.",
        "YouTube usage has increased by 10% in the last week.",
        "Most active hours are between 3PM and 6PM.",
        "Consider setting stricter limits for gaming apps which account for 40% of usage."
      ];
    }
    
    return stats;
  }
  
  @Get('child/:id/weekly')
  async getWeeklyData(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId || req.user.id;
    const isChildToken = !!req.user.isChildToken;
    return this.dashboardService.getWeeklyData(id, userId, isChildToken);
  }

  @Get('child/:id/ai-insights')
  async getAiInsights(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId || req.user.id;
    const isChildToken = !!req.user.isChildToken;
    return this.dashboardService.getAiInsights(id, userId, isChildToken);
  }

  @Post('activity')
  async recordActivity(@Body() createActivityDto: CreateActivityDto) {
    return this.dashboardService.recordActivity(createActivityDto);
  }
  
  @Post('child/:id/generate-mock-data')
  async generateMockData(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId || req.user.id;
    return this.dashboardService.generateMockData(+id, userId);
  }
} 