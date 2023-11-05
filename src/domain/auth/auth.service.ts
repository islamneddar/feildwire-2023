import {Injectable, Logger} from '@nestjs/common';
import {InjectEntityManager} from '@nestjs/typeorm';
import {EntityManager} from 'typeorm';
import {JWT_SECRET} from '@/configs/env.constant';
import {JwtService} from '@nestjs/jwt';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly LOG = new Logger(AuthService.name);
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateToken(param: {id: string; email: string}) {
    return await this.jwtService.signAsync(
      {
        id: param.id,
        email: param.email,
      },
      {
        secret: this.configService.get(JWT_SECRET),
      },
    );
  }
}
