import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  private readonly secret: string;

  constructor(private readonly configService: ConfigService) {
    this.secret = this.configService.get<string>('JWT_SECRET')!;
  }

  generateToken(
    payload: Record<string, any>,
    rememberPassword: boolean,
  ): string {
    if (rememberPassword) {
      return jwt.sign(payload, this.secret);
    }

    return jwt.sign(payload, this.secret, { expiresIn: '24h' });
  }

  verifyToken(token: string): Record<string, any> {
    return jwt.verify(token, this.secret) as Record<string, any>;
  }
}
