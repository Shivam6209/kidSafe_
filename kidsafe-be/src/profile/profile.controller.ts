import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProfileService } from './profile.service';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import { RegisterDeviceTokenDto } from './dto/register-device-token.dto';

@Controller('profile')
@UseGuards(AuthGuard('jwt'))
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('children')
  getChildren(@Request() req) {
    const userId = req.user.userId || req.user.id;
    return this.profileService.getChildren(userId);
  }

  @Get('children/:id')
  getChild(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId || req.user.id;
    return this.profileService.getChild(+id, userId);
  }

  @Post('children')
  createChild(@Body() createChildDto: CreateChildDto, @Request() req) {
    const userId = req.user.userId || req.user.id;
    return this.profileService.createChild(userId, createChildDto);
  }

  @Patch('children/:id')
  updateChild(
    @Param('id') id: string,
    @Body() updateChildDto: UpdateChildDto,
    @Request() req,
  ) {
    const userId = req.user.userId || req.user.id;
    return this.profileService.updateChild(+id, userId, updateChildDto);
  }

  @Delete('children/:id')
  deleteChild(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId || req.user.id;
    return this.profileService.deleteChild(+id, userId);
  }

  @Post('children/:id/device-token')
  registerDeviceToken(
    @Param('id') id: string,
    @Body() registerDeviceTokenDto: RegisterDeviceTokenDto,
    @Request() req,
  ) {
    const userId = req.user.userId || req.user.id;
    const childId = +id;
    return this.profileService.registerDeviceToken(childId, userId, registerDeviceTokenDto.deviceToken);
  }
} 