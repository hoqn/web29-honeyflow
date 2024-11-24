import { Controller, Get, Post } from '@nestjs/common';
import { CacheContextService } from './cache-context.service';

@Controller('cache-context')
export class CacheContextController {
  constructor(private readonly cacheContextService: CacheContextService) {}

  @Post()
  async cacheContextSave(key, value) {}
  @Get()
  async cacheContextFind(test: string) {}
}
