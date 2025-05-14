import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'kidsafe-secret-key',
    });
  }

  async validate(payload: { userId: number, childId?: number, isChildToken?: boolean }) {
    // If this is a child token, just validate user and return token data
    if (payload.isChildToken) {
      const user = await this.authService.validateUser(payload.userId);
      if (!user) {
        throw new UnauthorizedException();
      }
      return {
        userId: payload.userId,
        childId: payload.childId,
        isChildToken: true
      };
    }
    
    // Regular parent token
    const user = await this.authService.validateUser(payload.userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    return { id: user.id, email: user.email, name: user.name };
  }
} 