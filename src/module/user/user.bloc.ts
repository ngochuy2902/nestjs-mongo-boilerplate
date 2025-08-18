import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { ValidatorException } from '@exception/validator.exception';
import { FetchUserReq } from '@module/user/dto/req/fetch-user.req';
import { UserCreateReq } from '@module/user/dto/req/user-create.req';
import { UserRes } from '@module/user/dto/res/user.res';
import { UserService } from '@module/user/user.service';
import { ErrorCode } from '@share/constant/error.code';
import { AppLogger } from '@share/module/logger/app-logger.config';
import { PageRequest } from '@share/page/page-request';
import { PaginationRes } from '@share/page/response/pagination.res';
import { EncryptionUtil } from '@util/encryption.util';

@Injectable()
export class UserBloc {
  constructor(
    private readonly userService: UserService,
    private readonly log: AppLogger,
  ) {
    this.log.setContext(UserBloc.name);
  }

  async createUser(currentUserId: string, req: UserCreateReq): Promise<UserRes> {
    const { password, ...userData } = req;
    const { username, name, role } = userData;
    this.log.info(`Create user with username #${username}, name #${name} and role #${role}`);
    const existUser = await this.userService.getByUsername(username);
    if (existUser) {
      throw new ValidatorException(
        `User with username #${username} already exists`,
        ErrorCode.USER_ALREADY_EXIST,
      );
    }
    const passwordHash = await EncryptionUtil.generateHash(password);

    const user = await this.userService.save({
      ...req,
      password: passwordHash,
      createdBy: currentUserId,
    });

    return plainToInstance(UserRes, user, {
      excludeExtraneousValues: true,
    });
  }

  async searchUsers(req: FetchUserReq): Promise<PaginationRes<UserRes>> {
    this.log.info(`Fetch all users by req #`, req);
    const { keyword } = req;
    const pageRequest = PageRequest.ofRequest(req);
    const users = await this.userService.fetchUsers(keyword, pageRequest);

    return users.map((user) =>
      plainToInstance(UserRes, user, {
        excludeExtraneousValues: true,
      }),
    );
  }

  async getById(id: string): Promise<UserRes> {
    this.log.info(`Get user by id #${id}`);
    const user = await this.userService.getById(id);
    if (!user) {
      throw new NotFoundException(`User with id #${id} not found`);
    }

    return plainToInstance(UserRes, user, {
      excludeExtraneousValues: true,
    });
  }

  async getCurrentUserProfile(currentUserId: string): Promise<UserRes> {
    this.log.info(`Get current user profile by currentUserId #${currentUserId}`);

    const user = await this.userService.getById(currentUserId);
    return plainToInstance(UserRes, user, {
      excludeExtraneousValues: true,
    });
  }

  async changePassword(currentUserId: string, currentPassword: string, newPassword: string) {
    this.log.info(`Change password by currentUserId #${currentUserId}`);

    const user = await this.userService.getById(currentUserId);
    const { password: currentPasswordHash } = user;
    if (!(await EncryptionUtil.verifyHash(currentPassword, currentPasswordHash))) {
      throw new ValidatorException('Invalid currentPassword', ErrorCode.WRONG_PASSWORD);
    }
    const newPasswordHash = await EncryptionUtil.generateHash(newPassword);

    await this.userService.save({
      ...user,
      password: newPasswordHash,
      updatedBy: currentUserId,
    });
  }
}
