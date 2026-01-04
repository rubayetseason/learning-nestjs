import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';
import { User } from './user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async createUser(data: RegisterUserDto) {
    try {
      return await this.userModel.create({
        name: data.name,
        email: data.email,
        password: data.password,
      });
    } catch (error) {
      console.error('❌ Mongo error:', error);
      throw error;
    }
  }
}
