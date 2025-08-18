import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MongoDBConfig } from '@database/data-source';
import { AppController } from '@module/app.controller';
import { ShareModule } from '@share/module/share.module';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => {
        return MongoDBConfig;
      },
    }),
    ShareModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
