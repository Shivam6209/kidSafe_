import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DashboardService } from './dashboard.service';
import { CreateActivityDto } from './dto/create-activity.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('stats/:childId')
  getChildStats(@Param('childId') childId: string, @Request() req) {
    return this.dashboardService.getChildStats(childId, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('weekly/:childId')
  getWeeklyData(@Param('childId') childId: string) {
    return this.dashboardService.getWeeklyData(childId);
  }

  // This endpoint doesn't need auth since it's used by the child app
  @Post('activity')
  recordActivity(@Body() createActivityDto: CreateActivityDto) {
    return this.dashboardService.recordActivity(createActivityDto);
  }
} 