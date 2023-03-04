import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import * as Redis from 'redis';

@Injectable()
export class RedisClientService implements OnModuleInit {
  public redisCache;
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  onModuleInit() {
    this.createClient();
  }

  private createClient() {
    this.redisCache = Redis.createClient({
      url: process.env.REDIS_URL,
    });
  }
}
