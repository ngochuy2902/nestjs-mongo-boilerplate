import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class UserRes {
  @Expose()
  @ApiProperty()
  @Transform(({ obj }) => String(obj._id))
  _id: string;

  @Expose()
  @ApiProperty()
  username: string;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  activated: boolean;
}
