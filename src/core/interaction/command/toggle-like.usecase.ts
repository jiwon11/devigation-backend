import { Injectable, Inject } from '@nestjs/common';
import { Result } from '@common/types/result.type';
import { Like } from '@domain/interaction/like';
import { UserId } from '@domain/user/user-id';
import { TargetType } from '@domain/interaction/target-type';
import { LIKE_REPOSITORY, LikeRepositoryPort } from '../port/out/like-repository.port';

export class ToggleLikeCommand {
  constructor(
    public readonly userId: string,
    public readonly targetType: TargetType,
    public readonly targetId: string,
  ) {}
}

export interface ToggleLikeResult {
  liked: boolean;
  like?: Like;
}

@Injectable()
export class ToggleLikeUseCase {
  constructor(
    @Inject(LIKE_REPOSITORY)
    private readonly likeRepository: LikeRepositoryPort,
  ) {}

  async execute(command: ToggleLikeCommand): Promise<Result<ToggleLikeResult, Error>> {
    try {
      const userId = UserId.create(command.userId);
      const isLiked = await this.likeRepository.isLiked(
        userId,
        command.targetType,
        command.targetId,
      );

      if (isLiked) {
        // Unlike
        await this.likeRepository.deleteByUserAndTarget(
          userId,
          command.targetType,
          command.targetId,
        );
        return Result.ok({ liked: false });
      } else {
        // Like
        const like = Like.create({
          userId,
          targetType: command.targetType,
          targetId: command.targetId,
        });
        const savedLike = await this.likeRepository.save(like);
        return Result.ok({ liked: true, like: savedLike });
      }
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error(String(error)));
    }
  }
}