import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ProjectEntity} from '@/domain/project/project.entity';
import {ProjectController} from '@/domain/project/project.controller';
import {ProjectService} from '@/domain/project/project.service';
import {AuthModule} from '@/domain/auth/auth.module';
import {UserModule} from '@/domain/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity]), AuthModule, UserModule],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
