import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  createUser() {
    return 'User created successfully in user service';
  }
}
