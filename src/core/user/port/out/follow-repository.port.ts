import { Option } from '@common/types/option.type';
import { Follow, FollowId } from '@domain/user/follow';
import { UserId } from '@domain/user/user-id';
import { PaginationParams, Paginated } from '@common/types/pagination.type';

export const FOLLOW_REPOSITORY = Symbol('FOLLOW_REPOSITORY');

export interface FollowRepositoryPort {
  save(follow: Follow): Promise<Follow>;
  findById(id: FollowId): Promise<Option<Follow>>;
  findByFollowerAndFollowing(followerId: UserId, followingId: UserId): Promise<Option<Follow>>;
  findFollowers(userId: UserId, params: PaginationParams): Promise<Paginated<Follow>>;
  findFollowing(userId: UserId, params: PaginationParams): Promise<Paginated<Follow>>;
  delete(id: FollowId): Promise<void>;
  deleteByFollowerAndFollowing(followerId: UserId, followingId: UserId): Promise<void>;
  isFollowing(followerId: UserId, followingId: UserId): Promise<boolean>;
  countFollowers(userId: UserId): Promise<number>;
  countFollowing(userId: UserId): Promise<number>;
}