import {ThrottlerModule} from '@nestjs/throttler';
import {ConfigModule, ConfigService} from '@nestjs/config';

export const RateLimiterMiddleware = ThrottlerModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => [
    {
      ttl: config.get<number>('THROTTLE_TTL'),
      limit: config.get<number>('THROTTLE_LIMIT'),
    },
  ],
});
