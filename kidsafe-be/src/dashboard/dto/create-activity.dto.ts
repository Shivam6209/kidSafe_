import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateActivityDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsNotEmpty()
  @IsNumber()
  duration: number;

  @IsOptional()
  @IsString()
  url?: string;

  @IsNotEmpty()
  @IsNumber()
  childId: number;
} 