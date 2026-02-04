import { Option } from '@common/types/option.type';
import { Like, LikeId } from '@domain/interaction/like';
import { UserId } from '@domain/user/user-id';
import { TargetType } from '@domain/interaction/target-type';

export const LIKE_REPOSITORY = Symbol('LIKE_REPOSITORY');

export interface LikeRepositoryPort {
  save(like: Like): Promise<Like>;
  findById(id: LikeId): Promise<Option<Like>>;
  findByUserAndTarget(userId: UserId, targetType: TargetType, targetId: string): Promise<Option<Like>>;
  delete(id: LikeId): Promise<void>;
  deleteByUserAndTarget(userId: UserId, targetType: TargetType, targetId: string): Promise<void>;
  countByTarget(targetType: TargetType, targetId: string): Promise<number>;
  isLiked(userId: UserId, targetType: TargetType, targetId: string): Promise<boolean>;
}