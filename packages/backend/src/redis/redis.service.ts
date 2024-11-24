import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService {
  private logger = new Logger(RedisService.name);
  private redis: Redis;
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {
    this.redis = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
      password: this.configService.get<string>('REDIS_PASSWORD'),
    });
  }
  async set() {}

  async get() {}
}
