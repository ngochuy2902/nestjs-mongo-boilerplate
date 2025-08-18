import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { RoleEnum } from '@share/enum/role.enum';
import { BaseSchemaModel } from '@share/schema/base.schema';
import { BaseSchema } from '@share/schema/base-decorator.schema';

export type UserModel = User & Document;

@BaseSchema('users')
export class User extends BaseSchemaModel {
  @Prop({ unique: true, required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  role: RoleEnum;

  @Prop({ required: true, default: true })
  activated: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
