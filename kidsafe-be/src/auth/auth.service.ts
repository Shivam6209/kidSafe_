import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { OtpService } from '../shared/otp.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private otpService: OtpService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ user: Partial<User>; token: string }> {
    const { name, email, password } = registerDto;

    // Check if user already exists
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email is already in use');
    }

    // Verify that OTP was validated for this email
    if (!this.otpService.isVerified(email)) {
      throw new BadRequestException('Email not verified. Please verify your email first.');
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

    // Clear OTP verification after successful registration
    this.otpService.clearVerification(email);

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

  async childLogin(deviceId: string): Promise<{ success: boolean; childId: number; token: string; child: any }> {
    // Find child by device ID
    const child = await this.usersRepository.manager.getRepository('Child')
      .findOne({ 
        where: { deviceId },
        relations: ['parent'] 
      });

    if (!child) {
      throw new UnauthorizedException('Invalid device ID');
    }

    // Generate token with childId and parentId for proper authorization
    const token = this.jwtService.sign({ 
      userId: child.parent.id, // Use parent ID for authorization
      childId: child.id,
      isChildToken: true
    });

    // Return child data without sensitive info
    const { parent, ...childData } = child;

    return {
      success: true,
      childId: child.id,
      token,
      child: childData
    };
  }

  async validateUser(userId: number): Promise<any> {
    try {
      const user = await this.usersRepository.findOne({ 
        where: { id: userId },
        select: ['id', 'name', 'email'] // Only select non-sensitive fields
      });
      
      if (!user) {
        return null;
      }
      
      return user;
    } catch (error) {
      return null;
    }
  }

  /**
   * Send OTP to user's email for verification
   */
  async sendOtp(email: string): Promise<{ success: boolean; message: string }> {
    // Check if email already exists and verified
    const existingUser = await this.usersRepository.findOne({ 
      where: { email },
      select: ['id']
    });

    // If sending OTP for existing user login, let it proceed
    // If for registration, make sure email doesn't exist
    const result = await this.otpService.sendOTP(email);
    
    if (result) {
      return {
        success: true,
        message: 'OTP sent successfully. Please check your email.',
      };
    } else {
      throw new BadRequestException('Failed to send OTP. Please try again later.');
    }
  }

  /**
   * Verify OTP sent to user's email
   */
  async verifyOtp(email: string, otp: string): Promise<{ success: boolean; message: string }> {
    const isValid = this.otpService.verifyOTP(email, otp);
    
    if (isValid) {
      return {
        success: true,
        message: 'Email verified successfully.',
      };
    } else {
      throw new BadRequestException('Invalid or expired OTP. Please try again.');
    }
  }
} 