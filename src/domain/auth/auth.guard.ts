import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {Request} from 'express';
import {JwtService} from '@nestjs/jwt';
import {ConfigService} from '@nestjs/config';
import {UserService} from '@/domain/user/user.service';
import {JWT_SECRET} from '@/configs/env.constant';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('unauthorized');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get(JWT_SECRET),
      });

      const user = await this.userService.findOneByIdAndEmail({
        id: payload.id,
        email: payload.email,
      });
      if (!user) {
        throw new UnauthorizedException('unauthorized');
      }
      request.user = user;
    } catch (e) {
      throw new UnauthorizedException('unauthorized');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
