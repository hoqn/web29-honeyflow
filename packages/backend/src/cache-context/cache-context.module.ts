import { Global, Module } from '@nestjs/common';
import { CacheContextController } from './cache-context.controller';
import { CacheContextService } from './cache-context.service';

@Global()
@Module({
  controllers: [CacheContextController],
  providers: [CacheContextService],
})
export class CacheContextModule {}
