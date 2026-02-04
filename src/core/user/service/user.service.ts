import { Injectable, Inject } from '@nestjs/common';
import { Option } from '@common/types/option.type';
import { User } from '@domain/user/user';
import { UserId } from '@domain/user/user-id';
import { USER_REPOSITORY, UserRepositoryPort } from '../port/out/user-repository.port';
import { FOLLOW_REPOSITORY, FollowRepositoryPort } from '../port/out/follow-repository.port';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(FOLLOW_REPOSITORY)
    private readonly followRepository: FollowRepositoryPort,
  ) {}

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    return this.followRepository.isFollowing(
      UserId.create(followerId),
      UserId.create(followingId),
    );
  }

  async getUserWithFollowStatus(
    userId: string,
    currentUserId?: string,
  ): Promise<{ user: User; isFollowing: boolean } | null> {
    const userOption = await this.userRepository.findById(UserId.create(userId));

    if (!Option.isSome(userOption)) {
      return null;
    }

    let isFollowing = false;
    if (currentUserId !== undefined && currentUserId !== userId) {
      isFollowing = await this.isFollowing(currentUserId, userId);
    }

    return {
      user: userOption.value,
      isFollowing,
    };
  }
}