import {ConfigModule} from '@nestjs/config';
import {Module} from '@nestjs/common';
import {ThrottlerGuard} from '@nestjs/throttler';
import {APP_GUARD} from '@nestjs/core';
import {RateLimiterMiddleware} from '@/middleware/rate-limiter.middlware';
import {Modules} from '@/modules';
import {DbModule} from '@/database/db.config';
import dataSource from '@/database/data-source';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dataSource],
    }),
    RateLimiterMiddleware,
    DbModule,
    ...Modules,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [],
})
export default class AppModule {}
