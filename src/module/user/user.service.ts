import { Injectable } from '@nestjs/common';
import { User } from 'src/schema';

import { NotFoundException } from '@exception/not-found.exception';
import { UserRepository } from '@module/user/user.repository';
import { AppLogger } from '@share/module/logger/app-logger.config';
import { Page } from '@share/page/page';
import { PageRequest } from '@share/page/page-request';

@Injectable()
export class UserService {
  constructor(
    private readonly repository: UserRepository,
    private readonly log: AppLogger,
  ) {
    this.log.setContext(UserService.name);
  }

  async save(user: Partial<User>): Promise<User> {
    this.log.info(`Save user by with data #`, user);

    return this.repository.save(user);
  }

  async getById(id: string): Promise<User> {
    this.log.info(`Get user by id #${id}`);

    const user = await this.repository.getById(id);
    if (!user) {
      throw new NotFoundException(`User with id #${id} not found`);
    }

    return user;
  }

  async getByUsername(username: string): Promise<User> {
    this.log.info(`Get user by username #${username}`);

    return this.repository.getByUsername(username);
  }

  async fetchUsers(keyword: string, pageRequest: PageRequest): Promise<Page<User>> {
    this.log.info(`Fetch all users by keyword #${keyword} and pageRequest #`, pageRequest);

    return this.repository.fetchUsers(keyword, pageRequest);
  }
}
