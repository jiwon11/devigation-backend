import { Injectable } from '@nestjs/common';
import { Option } from '@common/types/option.type';
import { Paginated, Pagination, PaginationParams } from '@common/types/pagination.type';
import { Follow, FollowId } from '@domain/user/follow';
import { UserId } from '@domain/user/user-id';
import { FollowRepositoryPort } from '@core/user/port/out/follow-repository.port';
import { SupabaseService } from '@infrastructure/supabase/supabase.service';

interface FollowRow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

@Injectable()
export class SupabaseFollowRepository implements FollowRepositoryPort {
  constructor(private readonly supabase: SupabaseService) {}

  async save(follow: Follow): Promise<Follow> {
    const { error } = await this.supabase
      .getAdminClient()
      .from('follows')
      .upsert({
        id: follow.id.value,
        follower_id: follow.followerId.value,
        following_id: follow.followingId.value,
      })
      .single();

    if (error !== null) {
      throw new Error(`Failed to save follow: ${error.message}`);
    }

    return follow;
  }

  async findById(id: FollowId): Promise<Option<Follow>> {
    const { data, error } = await this.supabase
      .getClient()
      .from('follows')
      .select('*')
      .eq('id', id.value)
      .single();

    if (error !== null || data === null) {
      return Option.none();
    }

    return Option.some(this.toDomain(data as FollowRow));
  }

  async findByFollowerAndFollowing(
    followerId: UserId,
    followingId: UserId,
  ): Promise<Option<Follow>> {
    const { data, error } = await this.supabase
      .getClient()
      .from('follows')
      .select('*')
      .eq('follower_id', followerId.value)
      .eq('following_id', followingId.value)
      .single();

    if (error !== null || data === null) {
      return Option.none();
    }

    return Option.some(this.toDomain(data as FollowRow));
  }

  async findFollowers(userId: UserId, params: PaginationParams): Promise<Paginated<Follow>> {
    const offset = Pagination.getOffset(params);
    const { data, error, count } = await this.supabase
      .getClient()
      .from('follows')
      .select('*', { count: 'exact' })
      .eq('following_id', userId.value)
      .range(offset, offset + params.limit - 1)
      .order('created_at', { ascending: false });

    if (error !== null) {
      throw new Error(`Failed to find followers: ${error.message}`);
    }

    const follows = (data ?? []).map((row) => this.toDomain(row as FollowRow));
    return Pagination.create(follows, params, count ?? 0);
  }

  async findFollowing(userId: UserId, params: PaginationParams): Promise<Paginated<Follow>> {
    const offset = Pagination.getOffset(params);
    const { data, error, count } = await this.supabase
      .getClient()
      .from('follows')
      .select('*', { count: 'exact' })
      .eq('follower_id', userId.value)
      .range(offset, offset + params.limit - 1)
      .order('created_at', { ascending: false });

    if (error !== null) {
      throw new Error(`Failed to find following: ${error.message}`);
    }

    const follows = (data ?? []).map((row) => this.toDomain(row as FollowRow));
    return Pagination.create(follows, params, count ?? 0);
  }

  async delete(id: FollowId): Promise<void> {
    const { error } = await this.supabase
      .getAdminClient()
      .from('follows')
      .delete()
      .eq('id', id.value);

    if (error !== null) {
      throw new Error(`Failed to delete follow: ${error.message}`);
    }
  }

  async deleteByFollowerAndFollowing(followerId: UserId, followingId: UserId): Promise<void> {
    const { error } = await this.supabase
      .getAdminClient()
      .from('follows')
      .delete()
      .eq('follower_id', followerId.value)
      .eq('following_id', followingId.value);

    if (error !== null) {
      throw new Error(`Failed to delete follow: ${error.message}`);
    }
  }

  async isFollowing(followerId: UserId, followingId: UserId): Promise<boolean> {
    const { count, error } = await this.supabase
      .getClient()
      .from('follows')
      .select('id', { count: 'exact', head: true })
      .eq('follower_id', followerId.value)
      .eq('following_id', followingId.value);

    if (error !== null) {
      return false;
    }

    return (count ?? 0) > 0;
  }

  async countFollowers(userId: UserId): Promise<number> {
    const { count, error } = await this.supabase
      .getClient()
      .from('follows')
      .select('id', { count: 'exact', head: true })
      .eq('following_id', userId.value);

    if (error !== null) {
      return 0;
    }

    return count ?? 0;
  }

  async countFollowing(userId: UserId): Promise<number> {
    const { count, error } = await this.supabase
      .getClient()
      .from('follows')
      .select('id', { count: 'exact', head: true })
      .eq('follower_id', userId.value);

    if (error !== null) {
      return 0;
    }

    return count ?? 0;
  }

  private toDomain(row: FollowRow): Follow {
    return Follow.reconstitute(
      FollowId.create(row.id),
      {
        followerId: UserId.create(row.follower_id),
        followingId: UserId.create(row.following_id),
      },
      new Date(row.created_at),
    );
  }
}