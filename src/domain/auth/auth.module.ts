import {Module} from '@nestjs/common';
import {UserModule} from '@/domain/user/user.module';
import {JwtModule} from '@nestjs/jwt';
import {ConfigService} from '@nestjs/config';
import {AuthService} from '@/domain/auth/auth.service';
import {AuthController} from '@/domain/auth/auth.controller';
import {JWT_SECRET} from '@/configs/env.constant';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get(JWT_SECRET),
        signOptions: {
          expiresIn: '365d',
        },
      }),
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
