import { Connection } from 'mongoose';

import { User, UserSchema } from '@schema';
import { SystemDefault } from '@share/constant/common.constant';
import { RoleEnum } from '@share/enum/role.enum';
import { EncryptionUtil } from '@util/encryption.util';

export default class AddDefaultUserSeeder {
  public async run(connection: Connection): Promise<void> {
    const UserModel = connection.model(User.name, UserSchema, 'users');

    const superAdmin: Partial<User> = {
      username: 'superadmin',
      password: await EncryptionUtil.generateHash('admin@123'),
      name: 'Super Admin',
      role: RoleEnum.SUPER_ADMIN,
      createdBy: SystemDefault,
    };
    const admin: Partial<User> = {
      username: 'admin',
      password: await EncryptionUtil.generateHash('admin@123'),
      name: 'Admin',
      role: RoleEnum.ADMIN,
      createdBy: SystemDefault,
    };
    const user: Partial<User> = {
      username: 'user',
      password: await EncryptionUtil.generateHash('user@123'),
      name: 'User',
      role: RoleEnum.USER,
      createdBy: SystemDefault,
    };
    const users = [superAdmin, admin, user];
    await UserModel.insertMany(users);
  }
}
