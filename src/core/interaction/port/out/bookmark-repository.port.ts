import { Option } from '@common/types/option.type';
import { Paginated, PaginationParams } from '@common/types/pagination.type';
import { Bookmark, BookmarkId } from '@domain/interaction/bookmark';
import { UserId } from '@domain/user/user-id';
import { TargetType } from '@domain/interaction/target-type';

export const BOOKMARK_REPOSITORY = Symbol('BOOKMARK_REPOSITORY');

export interface BookmarkRepositoryPort {
  save(bookmark: Bookmark): Promise<Bookmark>;
  findById(id: BookmarkId): Promise<Option<Bookmark>>;
  findByUserAndTarget(userId: UserId, targetType: TargetType, targetId: string): Promise<Option<Bookmark>>;
  findByUser(userId: UserId, params: PaginationParams): Promise<Paginated<Bookmark>>;
  delete(id: BookmarkId): Promise<void>;
  deleteByUserAndTarget(userId: UserId, targetType: TargetType, targetId: string): Promise<void>;
  isBookmarked(userId: UserId, targetType: TargetType, targetId: string): Promise<boolean>;
}