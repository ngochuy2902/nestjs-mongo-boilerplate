import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

import { ApiOkPaginationRes } from '@config/swagger.config';
import { FetchUserReq } from '@module/user/dto/req/fetch-user.req';
import { UserChangePasswordReq } from '@module/user/dto/req/user-change-password.req';
import { Roles } from '@security/decorator/role.decorator';
import { JwtGuard } from '@security/guard/jwt.guard';
import { RolesGuard } from '@security/guard/role.guard';
import { Ctx } from '@security/request-context/req-context.decorator';
import { CtxReq } from '@security/request-context/request-context.dto';
import { ApiKeyName } from '@share/constant/common.constant';
import { RoleEnum } from '@share/enum/role.enum';
import { PaginationRes } from '@share/page/response/pagination.res';

import { UserCreateReq } from './dto/req/user-create.req';
import { UserRes } from './dto/res/user.res';
import { UserBloc } from './user.bloc';

@Controller('users')
@ApiTags('User')
@UseGuards(JwtGuard, RolesGuard)
@Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
export class UserController {
  constructor(private readonly userBloc: UserBloc) {}

  @Post()
  @ApiSecurity(ApiKeyName)
  @ApiOperation({ summary: 'Create user' })
  @ApiOkResponse({ type: UserRes })
  async createUser(@Ctx() ctx: CtxReq, @Body() req: UserCreateReq): Promise<UserRes> {
    return this.userBloc.createUser(ctx.userId, req);
  }

  @Get()
  @ApiSecurity(ApiKeyName)
  @ApiOperation({ summary: 'Fetch all users' })
  @ApiOkPaginationRes(UserRes)
  async searchUsers(@Query() req: FetchUserReq): Promise<PaginationRes<UserRes>> {
    return this.userBloc.searchUsers(req);
  }

  @Get('me')
  @ApiSecurity(ApiKeyName)
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.USER)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiOkResponse({ type: UserRes })
  async getCurrentUserProfile(@Ctx() ctx: CtxReq): Promise<UserRes> {
    return this.userBloc.getCurrentUserProfile(ctx.userId);
  }

  @Get(':id')
  @ApiSecurity(ApiKeyName)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiOkResponse({ type: UserRes })
  async getUserById(@Param('id') id: string): Promise<UserRes> {
    return this.userBloc.getById(id);
  }

  @Put('change-password')
  @ApiSecurity(ApiKeyName)
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.USER)
  @ApiOperation({ summary: 'Change password' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async changePassword(
    @Ctx() ctx: CtxReq,
    @Body() passwordReq: UserChangePasswordReq,
  ): Promise<void> {
    await this.userBloc.changePassword(
      ctx.userId,
      passwordReq.currentPassword,
      passwordReq.newPassword,
    );
  }
}
