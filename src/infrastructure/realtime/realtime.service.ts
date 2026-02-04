import { Injectable } from '@nestjs/common';
import { SupabaseService } from '@infrastructure/supabase/supabase.service';

@Injectable()
export class RealtimeService {
  constructor(private readonly supabaseService: SupabaseService) {}

  subscribeToNotifications(userId: string, callback: (payload: unknown) => void): () => void {
    const channel = this.supabaseService
      .getClient()
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${userId}`,
        },
        callback,
      )
      .subscribe();

    return (): void => {
      void channel.unsubscribe();
    };
  }
}