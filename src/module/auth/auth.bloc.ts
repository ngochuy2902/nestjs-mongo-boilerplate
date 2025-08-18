import { Injectable } from '@nestjs/common';

import { UnauthorizedException } from '@exception/unauthorized.exception';
import { ValidatorException } from '@exception/validator.exception';
import { UserService } from '@module/user/user.service';
import { TokenProvider } from '@security/token-provider/token-provider';
import { ErrorCode } from '@share/constant/error.code';
import { TokenPayload } from '@share/dto/type/token-payload';
import { AppLogger } from '@share/module/logger/app-logger.config';
import { EncryptionUtil } from '@util/encryption.util';

import { LoginResDto } from './dto/res/login-res.dto';
import { RefreshTokenResDto } from './dto/res/refresh-token-res.dto';

@Injectable()
export class AuthBloc {
  constructor(
    private readonly userService: UserService,
    private readonly tokenProvider: TokenProvider,
    private readonly log: AppLogger,
  ) {
    this.log.setContext(AuthBloc.name);
  }

  async login(username: string, password: string): Promise<LoginResDto> {
    this.log.info(`Login by username #${username}`);

    const user = await this.userService.getByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Invalid username or password!');
    }

    const { _id, password: passwordHash, role } = user;
    if (!(await EncryptionUtil.verifyHash(password, passwordHash))) {
      throw new UnauthorizedException('Invalid username or password!');
    }

    const { accessToken, refreshToken } = this.tokenProvider.generateToken(_id.toString(), role);
    return { accessToken, refreshToken } as LoginResDto;
  }

  async refreshToken(currentRefreshToken: string): Promise<RefreshTokenResDto> {
    this.log.info('Refresh token');
    const payload: TokenPayload = this.tokenProvider.verifyToken(currentRefreshToken);
    if (!payload) {
      throw new ValidatorException('Invalid refreshToken', ErrorCode.INVALID_REFRESH_TOKEN);
    }
    const { _id: userId } = payload;
    const user = await this.userService.getById(userId);
    const { activated, role } = user;

    if (!activated) {
      throw new UnauthorizedException('User is not activated or first login');
    }

    const { accessToken, refreshToken } = this.tokenProvider.generateToken(userId, role);
    return { accessToken, refreshToken } as RefreshTokenResDto;
  }
}
