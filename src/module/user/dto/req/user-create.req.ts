import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, Length } from 'class-validator';

import { RoleEnum } from '@share/enum/role.enum';

export class UserCreateReq {
  @IsNotEmpty()
  @ApiProperty()
  @Length(4, 20)
  username: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty({ enum: RoleEnum })
  @IsEnum(RoleEnum)
  role: RoleEnum;
}
