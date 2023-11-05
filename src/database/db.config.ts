import {TypeOrmModule, TypeOrmModuleOptions} from '@nestjs/typeorm';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {TYPE_ORM} from '@/database/constants';

export const DbModule = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    return {
      ...configService.get(TYPE_ORM),
    } as TypeOrmModuleOptions;
  },
  inject: [ConfigService],
});
