import { Body, Controller, Post } from '@nestjs/common';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { RegisterUserDto, registerUserSchema } from './dto/register-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerUser(
    @Body(new ZodValidationPipe(registerUserSchema))
    data: RegisterUserDto,
  ) {
    return this.authService.registerUser(data);
  }
}
