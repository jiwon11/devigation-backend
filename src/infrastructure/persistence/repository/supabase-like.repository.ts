import { Injectable } from '@nestjs/common';
import { Option } from '@common/types/option.type';
import { Like, LikeId } from '@domain/interaction/like';
import { UserId } from '@domain/user/user-id';
import { TargetType } from '@domain/interaction/target-type';
import { LikeRepositoryPort } from '@core/interaction/port/out/like-repository.port';
import { SupabaseService } from '@infrastructure/supabase/supabase.service';

@Injectable()
export class SupabaseLikeRepository implements LikeRepositoryPort {
  constructor(private readonly supabase: SupabaseService) {}

  async save(like: Like): Promise<Like> {
    return like;
  }

  async findById(id: LikeId): Promise<Option<Like>> {
    return Option.none();
  }

  async findByUserAndTarget(
    userId: UserId,
    targetType: TargetType,
    targetId: string,
  ): Promise<Option<Like>> {
    return Option.none();
  }

  async delete(id: LikeId): Promise<void> {}

  async deleteByUserAndTarget(
    userId: UserId,
    targetType: TargetType,
    targetId: string,
  ): Promise<void> {}

  async countByTarget(targetType: TargetType, targetId: string): Promise<number> {
    return 0;
  }

  async isLiked(userId: UserId, targetType: TargetType, targetId: string): Promise<boolean> {
    return false;
  }
}