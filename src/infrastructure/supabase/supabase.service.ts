import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './supabase.types';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private supabase: SupabaseClient<Database> | null = null;
  private supabaseAdmin: SupabaseClient<Database> | null = null;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit(): void {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseAnonKey = this.configService.get<string>('SUPABASE_ANON_KEY');
    const supabaseServiceKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (supabaseUrl === undefined || supabaseAnonKey === undefined) {
      throw new Error('Supabase URL and Anon Key must be defined');
    }

    this.supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: false,
      },
    });

    if (supabaseServiceKey !== undefined) {
      this.supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });
    }
  }

  getClient(): SupabaseClient<Database> {
    if (this.supabase === null) {
      throw new Error('Supabase client not initialized');
    }
    return this.supabase;
  }

  getAdminClient(): SupabaseClient<Database> {
    if (this.supabaseAdmin === null) {
      throw new Error('Supabase admin client not initialized');
    }
    return this.supabaseAdmin;
  }
}