import { Module } from '@nestjs/common';
import { MemoryCacheAdapter } from './memory-cache.adapter';

@Module({
  providers: [MemoryCacheAdapter],
  exports: [MemoryCacheAdapter],
})
export class CacheModule {}