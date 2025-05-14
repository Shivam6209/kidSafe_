import { IsNotEmpty, IsNumber, IsOptional, IsString, IsBoolean, IsObject } from 'class-validator';

export class CreateActivityDto {
  @IsNumber()
  @IsNotEmpty()
  childId: number;
  
  @IsString()
  @IsNotEmpty()
  type: string;
  
  @IsString()
  @IsNotEmpty()
  name: string;
  
  @IsString()
  @IsOptional()
  url?: string;
  
  @IsString()
  @IsOptional()
  category?: string;
  
  @IsNumber()
  @IsOptional()
  duration?: number;
  
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
  
  @IsBoolean()
  @IsOptional()
  isRestricted?: boolean;
  
  @IsBoolean()
  @IsOptional()
  isBlocked?: boolean;
} 