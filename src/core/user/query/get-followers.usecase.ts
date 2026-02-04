import { Injectable, Inject } from '@nestjs/common';
import { Result } from '@common/types/result.type';
import { Paginated } from '@common/types/pagination.type';
import { User } from '@domain/user/user';
import { UserId } from '@domain/user/user-id';
import { GetFollowersQuery, GetFollowingQuery } from './get-followers.query';
import { USER_REPOSITORY, UserRepositoryPort } from '../port/out/user-repository.port';
import { FOLLOW_REPOSITORY, FollowRepositoryPort } from '../port/out/follow-repository.port';
import { Option } from '@common/types/option.type';

@Injectable()
export class GetFollowersUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(FOLLOW_REPOSITORY)
    private readonly followRepository: FollowRepositoryPort,
  ) {}

  async getFollowers(query: GetFollowersQuery): Promise<Result<Paginated<User>, Error>> {
    try {
      const userId = UserId.create(query.userId);
      const followsPaginated = await this.followRepository.findFollowers(userId, {
        page: query.page,
        limit: query.limit,
      });

      const users: User[] = [];
      for (const follow of followsPaginated.data) {
        const userOption = await this.userRepository.findById(follow.followerId);
        if (Option.isSome(userOption)) {
          users.push(userOption.value);
        }
      }

      return Result.ok({
        data: users,
        meta: followsPaginated.meta,
      });
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error(String(error)));
    }
  }

  async getFollowing(query: GetFollowingQuery): Promise<Result<Paginated<User>, Error>> {
    try {
      const userId = UserId.create(query.userId);
      const followsPaginated = await this.followRepository.findFollowing(userId, {
        page: query.page,
        limit: query.limit,
      });

      const users: User[] = [];
      for (const follow of followsPaginated.data) {
        const userOption = await this.userRepository.findById(follow.followingId);
        if (Option.isSome(userOption)) {
          users.push(userOption.value);
        }
      }

      return Result.ok({
        data: users,
        meta: followsPaginated.meta,
      });
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error(String(error)));
    }
  }
}