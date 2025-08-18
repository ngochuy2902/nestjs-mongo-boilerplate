import { Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export abstract class BaseSchemaModel {
  _id: Types.ObjectId;

  @Prop({ required: true })
  createdBy: string;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ required: false })
  updatedBy: string;

  @Prop({ type: Date, required: false })
  updatedAt: Date;
}
