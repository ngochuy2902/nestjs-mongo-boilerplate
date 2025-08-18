import { Schema } from '@nestjs/mongoose';

export function BaseSchema(collection: string): ClassDecorator {
  return Schema({
    collection,
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    versionKey: false,
  });
}
