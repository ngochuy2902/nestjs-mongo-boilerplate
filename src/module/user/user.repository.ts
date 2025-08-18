import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserModel } from '@schema';
import { Page } from '@share/page/page';
import { PageRequest } from '@share/page/page-request';
import { BaseRepository } from '@share/repository/base.repository';

@Injectable()
export class UserRepository extends BaseRepository<UserModel> {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserModel>) {
    super(userModel);
  }

  async getById(id: string): Promise<User> {
    return this.userModel.findById(id).lean().exec();
  }

  async getByUsername(username: string): Promise<User> {
    return this.userModel.findOne({ username }).lean().exec();
  }

  async fetchUsers(keyword: string, pageRequest: PageRequest): Promise<Page<User>> {
    const query = {
      ...(keyword && {
        $or: [
          { name: { $regex: keyword, $options: 'i' } },
          { username: { $regex: keyword, $options: 'i' } },
        ],
      }),
    };

    const [users, total] = await this.findAndCount(this.userModel, query, pageRequest);
    return Page.of(users, total, pageRequest);
  }
}
