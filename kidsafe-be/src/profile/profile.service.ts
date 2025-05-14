import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Child } from './entities/child.entity';
import { User } from '../auth/entities/user.entity';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Child)
    private childRepository: Repository<Child>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getChildren(userId: number): Promise<Child[]> {
    return this.childRepository.find({
      where: { parent: { id: userId } },
    });
  }

  async getChild(id: number, userId: number): Promise<Child> {
    const child = await this.childRepository.findOne({
      where: { id, parent: { id: userId } },
    });

    if (!child) {
      throw new NotFoundException(`Child with ID ${id} not found`);
    }

    return child;
  }

  async createChild(userId: number, createChildDto: CreateChildDto): Promise<Child> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate device ID if not provided
    const deviceId = createChildDto.deviceId || `device-${uuidv4().substring(0, 8)}`;

    // Check if device ID is already in use
    const existingChild = await this.childRepository.findOne({ where: { deviceId } });
    if (existingChild) {
      throw new ConflictException(`Device ID ${deviceId} is already in use`);
    }

    const child = this.childRepository.create({
      ...createChildDto,
      deviceId,
      parent: user,
    });

    return this.childRepository.save(child);
  }

  async updateChild(id: number, userId: number, updateChildDto: UpdateChildDto): Promise<Child> {
    // First check if child exists and belongs to user
    const child = await this.getChild(id, userId);

    // If updating device ID, check if it's already in use
    if (updateChildDto.deviceId) {
      const existingChild = await this.childRepository.findOne({ 
        where: { deviceId: updateChildDto.deviceId }
      });
      
      if (existingChild && existingChild.id !== id) {
        throw new ConflictException(`Device ID ${updateChildDto.deviceId} is already in use`);
      }
    }

    // Update the child
    Object.assign(child, updateChildDto);
    return this.childRepository.save(child);
  }

  async deleteChild(id: number, userId: number): Promise<void> {
    // First check if child exists and belongs to user
    const child = await this.getChild(id, userId);

    await this.childRepository.remove(child);
  }
} 