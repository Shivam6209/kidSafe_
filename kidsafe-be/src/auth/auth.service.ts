import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ user: Partial<User>; token: string }> {
    const { name, email, password } = registerDto;

    // Check if user already exists
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email is already in use');
    }

    // Hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.usersRepository.save(user);

    // Generate token
    const token = this.jwtService.sign({ userId: user.id });

    // Remove password from returned object
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  async login(loginDto: LoginDto): Promise<{ user: Partial<User>; token: string }> {
    const { email, password } = loginDto;

    // Find user
    const user = await this.usersRepository.findOne({ 
      where: { email },
      relations: ['children']
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate token
    const token = this.jwtService.sign({ userId: user.id });

    // Remove password from returned object
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  async childLogin(deviceId: string): Promise<{ success: boolean; childId: number }> {
    // This is simplified for demo - in a real app, would verify device ID and possibly use a different auth method
    // For now, just validate device ID exists
    const child = await this.usersRepository.manager.getRepository('Child')
      .findOne({ where: { deviceId } });

    if (!child) {
      throw new UnauthorizedException('Invalid device ID');
    }

    return {
      success: true,
      childId: child.id,
    };
  }

  async validateUser(userId: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    
    return user;
  }
} 