import { Injectable, Inject } from '@nestjs/common';
import { Result } from '@common/types/result.type';
import { Option } from '@common/types/option.type';
import { Follow } from '@domain/user/follow';
import { UserId } from '@domain/user/user-id';
import {
  UserNotFoundException,
  CannotFollowSelfException,
  AlreadyFollowingException,
  NotFollowingException,
} from '@domain/user/user.exception';
import { FollowUserCommand, UnfollowUserCommand } from './follow-user.command';
import { USER_REPOSITORY, UserRepositoryPort } from '../port/out/user-repository.port';
import { FOLLOW_REPOSITORY, FollowRepositoryPort } from '../port/out/follow-repository.port';

@Injectable()
export class FollowUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(FOLLOW_REPOSITORY)
    private readonly followRepository: FollowRepositoryPort,
  ) {}

  async follow(command: FollowUserCommand): Promise<Result<Follow, Error>> {
    try {
      const followerId = UserId.create(command.followerId);
      const followingId = UserId.create(command.followingId);

      // Cannot follow self
      if (followerId.equals(followingId)) {
        return Result.fail(new CannotFollowSelfException());
      }

      // Check if users exist
      const [followerOption, followingOption] = await Promise.all([
        this.userRepository.findById(followerId),
        this.userRepository.findById(followingId),
      ]);

      if (!Option.isSome(followerOption)) {
        return Result.fail(new UserNotFoundException(command.followerId));
      }

      if (!Option.isSome(followingOption)) {
        return Result.fail(new UserNotFoundException(command.followingId));
      }

      // Check if already following
      const isFollowing = await this.followRepository.isFollowing(followerId, followingId);
      if (isFollowing) {
        return Result.fail(
          new AlreadyFollowingException(command.followerId, command.followingId),
        );
      }

      // Create follow
      const follow = Follow.create(followerId, followingId);
      const savedFollow = await this.followRepository.save(follow);

      // Update counts
      const follower = followerOption.value;
      const following = followingOption.value;
      follower.incrementFollowingCount();
      following.incrementFollowerCount();

      await Promise.all([
        this.userRepository.save(follower),
        this.userRepository.save(following),
      ]);

      return Result.ok(savedFollow);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error(String(error)));
    }
  }

  async unfollow(command: UnfollowUserCommand): Promise<Result<void, Error>> {
    try {
      const followerId = UserId.create(command.followerId);
      const followingId = UserId.create(command.followingId);

      // Check if following
      const isFollowing = await this.followRepository.isFollowing(followerId, followingId);
      if (!isFollowing) {
        return Result.fail(
          new NotFollowingException(command.followerId, command.followingId),
        );
      }

      // Delete follow
      await this.followRepository.deleteByFollowerAndFollowing(followerId, followingId);

      // Update counts
      const [followerOption, followingOption] = await Promise.all([
        this.userRepository.findById(followerId),
        this.userRepository.findById(followingId),
      ]);

      if (Option.isSome(followerOption)) {
        followerOption.value.decrementFollowingCount();
        await this.userRepository.save(followerOption.value);
      }

      if (Option.isSome(followingOption)) {
        followingOption.value.decrementFollowerCount();
        await this.userRepository.save(followingOption.value);
      }

      return Result.ok(undefined);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error(String(error)));
    }
  }
}