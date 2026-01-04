import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import env from 'src/config/env';
import { User } from 'src/user/user.schema';
@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}
  async registerUser(data: RegisterUserDto): Promise<User> {
    console.log('Registering user:', data);
    const hash = await bcrypt.hash(
      data.password,
      Number(env.bcrypt_salt_rounds),
    );

    const user = await this.userService.createUser({ ...data, password: hash });
    /*
    check if email exists    
    hash password
    create user and store into db
    create jwt token
    return token
    */

    return user;
  }
}
