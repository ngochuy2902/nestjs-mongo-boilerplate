import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { JwtStrategy } from '@security/strategy/jwt.strategy';
import { TokenProviderModule } from '@security/token-provider/token-provider.module';

import { UserModule } from '../user/user.module';
import { AuthBloc } from './auth.bloc';
import { AuthController } from './auth.controller';

@Module({
  imports: [UserModule, TokenProviderModule, PassportModule],
  providers: [AuthBloc, JwtStrategy],
  exports: [AuthBloc],
  controllers: [AuthController],
})
export class AuthModule {}
