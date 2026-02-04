import { Injectable } from '@nestjs/common';
import { Option } from '@common/types/option.type';
import { Paginated, Pagination, PaginationParams } from '@common/types/pagination.type';
import { Bookmark, BookmarkId } from '@domain/interaction/bookmark';
import { UserId } from '@domain/user/user-id';
import { TargetType } from '@domain/interaction/target-type';
import { BookmarkRepositoryPort } from '@core/interaction/port/out/bookmark-repository.port';
import { SupabaseService } from '@infrastructure/supabase/supabase.service';

@Injectable()
export class SupabaseBookmarkRepository implements BookmarkRepositoryPort {
  constructor(private readonly supabase: SupabaseService) {}

  async save(bookmark: Bookmark): Promise<Bookmark> {
    return bookmark;
  }

  async findById(id: BookmarkId): Promise<Option<Bookmark>> {
    return Option.none();
  }

  async findByUserAndTarget(
    userId: UserId,
    targetType: TargetType,
    targetId: string,
  ): Promise<Option<Bookmark>> {
    return Option.none();
  }

  async findByUser(userId: UserId, params: PaginationParams): Promise<Paginated<Bookmark>> {
    return Pagination.create([], params, 0);
  }

  async delete(id: BookmarkId): Promise<void> {}

  async deleteByUserAndTarget(
    userId: UserId,
    targetType: TargetType,
    targetId: string,
  ): Promise<void> {}

  async isBookmarked(userId: UserId, targetType: TargetType, targetId: string): Promise<boolean> {
    return false;
  }
}