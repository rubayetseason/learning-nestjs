import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserService } from 'src/user/user.service';
import bcrypt from 'bcrypt';
import env from 'src/config/env';
@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  async registerUser(data: RegisterUserDto): Promise<string> {
    console.log('Registering user:', data);
    const hash = await bcrypt.hash(
      data.password,
      Number(env.bcrypt_salt_rounds),
    );

    this.userService.createUser();
    /*
    check if email exists    
    hash password
    create user and store into db
    create jwt token
    return token
    */

    return 'User registered successfully';
  }
}
