import { CacheModule, Module, Global } from '@nestjs/common';
import { RedisClientService } from './redis-client.service';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => ({
        ttl: 60000, // 1 hour
      }),
    }),
  ],
  providers: [RedisClientService],
  exports: [RedisClientService],
})
export class RedisClientModule {}
