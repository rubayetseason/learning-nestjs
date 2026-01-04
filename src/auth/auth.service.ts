import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  registerUser(data: RegisterUserDto): string {
    console.log('Registering user:', data);
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
