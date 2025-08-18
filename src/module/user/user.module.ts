import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schema';

import { UserBloc } from './user.bloc';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [UserBloc, UserService, UserRepository],
  controllers: [UserController],
  exports: [UserBloc, UserService],
})
export class UserModule {}
