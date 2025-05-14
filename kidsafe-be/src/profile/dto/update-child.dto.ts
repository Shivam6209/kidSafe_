import { IsString, IsNumber, IsOptional, IsArray, Min, Max } from 'class-validator';

export class UpdateChildDto {
  @IsOptional()
  @IsString()
  name?: string;
  
  @IsOptional()
  @IsString()
  deviceId?: string;

  @IsOptional()
  @IsNumber()
  @Min(15) // Minimum 15 minutes
  @Max(1440) // Maximum 24 hours (1440 minutes)
  dailyLimit?: number;

  @IsOptional()
  @IsArray()
  blockedWebsites?: string[];

  @IsOptional()
  @IsString()
  avatar?: string;
} 