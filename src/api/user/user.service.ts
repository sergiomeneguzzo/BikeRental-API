import { UserExistsError } from '../../errors/user-exists';
import { UserIdentityModel } from '../../utils/auth/local/user-identity.model';
import { User } from './user.entity';
import { UserModel } from './user.model';
import * as bcrypt from 'bcrypt';
import {
  PasswordMismatchError,
  SamePasswordError,
} from '../../errors/password';

export class UserService {
  async add(
    user: User,
    credentials: { username: string; password: string },
  ): Promise<User> {
    const existingIdentity = await UserIdentityModel.findOne({
      'credentials.username': credentials.username,
    });
    if (existingIdentity) {
      throw new UserExistsError();
    }

    const hashedPassword = await bcrypt.hash(credentials.password, 10);

    const newUser = await UserModel.create(user);
    await UserIdentityModel.create({
      provider: 'local',
      user: newUser.id,
      credentials: {
        username: credentials.username,
        hashedPassword,
      },
    });

    return newUser;
  }

  async list(): Promise<User[]> {
    const userList = await UserModel.find();
    return userList;
  }

  async updatePassword(
    user: User,
    newPassword: string,
    confirmPassword: string,
  ) {
    if (newPassword !== confirmPassword) {
      throw new PasswordMismatchError();
    }
    var existingIdentity = await UserIdentityModel.findOne({
      user: user.id!,
    });

    if (
      await this._comparePassword(
        newPassword,
        existingIdentity!.credentials.hashedPassword,
      )
    ) {
      throw new SamePasswordError();
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    existingIdentity!.credentials.hashedPassword = hashedPassword;

    existingIdentity!.save();

    return await this._getById(user.id!);
  }
  private async _getById(userId: string) {
    return await UserModel.findOne({ _id: userId });
  }

  private async _comparePassword(notEncripted: string, enrcripted: string) {
    const match = await bcrypt.compare(notEncripted, enrcripted);
    return match;
  }
}

export default new UserService();
