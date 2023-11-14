import {Body, Controller, Post} from '@nestjs/common';
import {AuthService} from '@/domain/auth/auth.service';
import {UserService} from '@/domain/user/user.service';
import {LoginRequest, SignupRequest} from '@/domain/auth/auth.dto';
import {
  UserAlreadyExistException,
  WrongEmailOrPasswordException,
} from '@/domain/auth/auth.error';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('login')
  async login(@Body() body: LoginRequest) {
    const email = body.email.trim().toLowerCase();
    const user = await this.userService.findOneByEmailAndPassword(
      email,
      body.password,
    );
    if (!user) {
      throw new WrongEmailOrPasswordException();
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
    const email = body.email.trim().toLowerCase();
    const user = await this.userService.findOneByEmail(email);
    if (user) {
      throw new UserAlreadyExistException();
    }
    await this.userService.createUser(email, body.password);
    return {
      message: 'user created',
    };
  }
}
