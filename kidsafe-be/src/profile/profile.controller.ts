import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProfileService } from './profile.service';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';

@Controller('profile')
@UseGuards(AuthGuard('jwt'))
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('children')
  getChildren(@Request() req) {
    return this.profileService.getChildren(req.user.id);
  }

  @Get('children/:id')
  getChild(@Param('id') id: string, @Request() req) {
    return this.profileService.getChild(+id, req.user.id);
  }

  @Post('children')
  createChild(@Body() createChildDto: CreateChildDto, @Request() req) {
    return this.profileService.createChild(req.user.id, createChildDto);
  }

  @Patch('children/:id')
  updateChild(
    @Param('id') id: string,
    @Body() updateChildDto: UpdateChildDto,
    @Request() req,
  ) {
    return this.profileService.updateChild(+id, req.user.id, updateChildDto);
  }

  @Delete('children/:id')
  deleteChild(@Param('id') id: string, @Request() req) {
    return this.profileService.deleteChild(+id, req.user.id);
  }
} 