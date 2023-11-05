import {
  Body,
  ConflictException,
  Controller,
  NotFoundException,
  Post,
} from '@nestjs/common';
import {AuthService} from '@/domain/auth/auth.service';
import {UserService} from '@/domain/user/user.service';
import {LoginRequest, SignupRequest} from '@/domain/auth/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('login')
  async login(@Body() body: LoginRequest) {
    const user = await this.userService.findOneByEmailAndPassword(
      body.email,
      body.password,
    );
    if (!user) {
      throw new NotFoundException('wrong email or password');
    }

    const userToken = await this.authService.generateToken({
      id: user.userId,
      email: user.email,
    });

    return {
      userId: user.userId,
      accessToken: userToken,
    };
  }

  @Post('signup')
  async signup(@Body() body: SignupRequest) {
    const user = await this.userService.findOneByEmail(body.email);
    if (user) {
      throw new ConflictException('user already exist');
    }
    await this.userService.createUser(body);
    return {
      message: 'user created',
    };
  }
}
