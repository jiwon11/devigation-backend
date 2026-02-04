import { Injectable } from '@nestjs/common';
import { SupabaseService } from '@infrastructure/supabase/supabase.service';
import { STORAGE_BUCKETS } from './storage.constants';

@Injectable()
export class SupabaseStorageAdapter {
  constructor(private readonly supabaseService: SupabaseService) {}

  async uploadFile(
    bucket: string,
    path: string,
    file: Buffer,
    contentType: string,
  ): Promise<string> {
    const { error } = await this.supabaseService
      .getAdminClient()
      .storage.from(bucket)
      .upload(path, file, {
        contentType,
        upsert: true,
      });

    if (error !== null) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }

    const { data } = this.supabaseService
      .getClient()
      .storage.from(bucket)
      .getPublicUrl(path);

    return data.publicUrl;
  }

  async deleteFile(bucket: string, path: string): Promise<void> {
    const { error } = await this.supabaseService
      .getAdminClient()
      .storage.from(bucket)
      .remove([path]);

    if (error !== null) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  async getSignedUrl(bucket: string, path: string, expiresIn: number = 3600): Promise<string> {
    const { data, error } = await this.supabaseService
      .getClient()
      .storage.from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error !== null || data === null) {
      throw new Error(`Failed to get signed URL: ${error?.message}`);
    }

    return data.signedUrl;
  }
}