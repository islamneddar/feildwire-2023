import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserEntity} from '@/domain/user/user.entity';
import {UserService} from '@/domain/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
