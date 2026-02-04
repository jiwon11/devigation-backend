import { Injectable, Inject } from '@nestjs/common';
import { Result } from '@common/types/result.type';
import { Bookmark } from '@domain/interaction/bookmark';
import { UserId } from '@domain/user/user-id';
import { TargetType } from '@domain/interaction/target-type';
import { BOOKMARK_REPOSITORY, BookmarkRepositoryPort } from '../port/out/bookmark-repository.port';

export class ToggleBookmarkCommand {
  constructor(
    public readonly userId: string,
    public readonly targetType: TargetType,
    public readonly targetId: string,
    public readonly note?: string,
  ) {}
}

export interface ToggleBookmarkResult {
  bookmarked: boolean;
  bookmark?: Bookmark;
}

@Injectable()
export class ToggleBookmarkUseCase {
  constructor(
    @Inject(BOOKMARK_REPOSITORY)
    private readonly bookmarkRepository: BookmarkRepositoryPort,
  ) {}

  async execute(command: ToggleBookmarkCommand): Promise<Result<ToggleBookmarkResult, Error>> {
    try {
      const userId = UserId.create(command.userId);
      const isBookmarked = await this.bookmarkRepository.isBookmarked(
        userId,
        command.targetType,
        command.targetId,
      );

      if (isBookmarked) {
        // Remove bookmark
        await this.bookmarkRepository.deleteByUserAndTarget(
          userId,
          command.targetType,
          command.targetId,
        );
        return Result.ok({ bookmarked: false });
      } else {
        // Add bookmark
        const bookmark = Bookmark.create({
          userId,
          targetType: command.targetType,
          targetId: command.targetId,
          note: command.note,
        });
        const savedBookmark = await this.bookmarkRepository.save(bookmark);
        return Result.ok({ bookmarked: true, bookmark: savedBookmark });
      }
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error(String(error)));
    }
  }
}