import { Module } from '@nestjs/common';
import { SupabaseModule } from './supabase/supabase.module';
import { PersistenceModule } from './persistence/persistence.module';
import { AuthInfraModule } from './auth/auth.module';
import { StorageModule } from './storage/storage.module';
import { RealtimeModule } from './realtime/realtime.module';
import { SearchInfraModule } from './search/search.module';
import { MessagingModule } from './messaging/messaging.module';
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [
    SupabaseModule,
    PersistenceModule,
    AuthInfraModule,
    StorageModule,
    RealtimeModule,
    SearchInfraModule,
    MessagingModule,
    CacheModule,
  ],
  exports: [
    SupabaseModule,
    PersistenceModule,
    AuthInfraModule,
    StorageModule,
    RealtimeModule,
    SearchInfraModule,
    MessagingModule,
    CacheModule,
  ],
})
export class InfrastructureModule {}