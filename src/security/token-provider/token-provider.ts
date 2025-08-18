import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ApplicationConfig } from '@config/application.config';
import { TokenPayload } from '@share/dto/type/token-payload';

@Injectable()
export class TokenProvider {
  private readonly tokenSecretKey: string;
  private readonly accessTokenExpired: number;
  private readonly refreshTokenExpired: number;

  constructor(private readonly jwtService: JwtService) {
    this.tokenSecretKey = ApplicationConfig.auth.tokenSecretKey;
    this.accessTokenExpired = ApplicationConfig.auth.accessTokenExpired;
    this.refreshTokenExpired = ApplicationConfig.auth.refreshTokenExpired;
  }

  generateToken(userId: string, role: string): { accessToken: string; refreshToken: string } {
    const payload: TokenPayload = { _id: userId, role };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.tokenSecretKey,
      expiresIn: this.accessTokenExpired,
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.tokenSecretKey,
      expiresIn: this.refreshTokenExpired,
    });

    return { accessToken, refreshToken };
  }

  verifyToken(token: string): TokenPayload {
    try {
      return this.jwtService.verify(token, { secret: this.tokenSecretKey });
      // eslint-disable-next-line
    } catch (e) {
      return null;
    }
  }
}
