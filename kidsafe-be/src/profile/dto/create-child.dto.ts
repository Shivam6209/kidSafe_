import { IsNotEmpty, IsString, IsNumber, IsOptional, IsArray, Min, Max } from 'class-validator';

export class CreateChildDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  
  @IsOptional()
  @IsString()
  deviceId?: string; // Optional - system can generate if not provided

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