import { Module } from '@nestjs/common';
import { SupabaseStorageAdapter } from './supabase-storage.adapter';

@Module({
  providers: [SupabaseStorageAdapter],
  exports: [SupabaseStorageAdapter],
})
export class StorageModule {}