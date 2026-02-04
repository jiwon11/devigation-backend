import { Injectable, Inject } from '@nestjs/common';
import { Result } from '@common/types/result.type';
import { Option } from '@common/types/option.type';
import { User } from '@domain/user/user';
import { UserId } from '@domain/user/user-id';
import { UserNotFoundException } from '@domain/user/user.exception';
import { UpdateProfileCommand } from './update-profile.command';
import { USER_REPOSITORY, UserRepositoryPort } from '../port/out/user-repository.port';

@Injectable()
export class UpdateProfileUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(command: UpdateProfileCommand): Promise<Result<User, Error>> {
    try {
      const userId = UserId.create(command.userId);
      const userOption = await this.userRepository.findById(userId);

      if (!Option.isSome(userOption)) {
        return Result.fail(new UserNotFoundException(command.userId));
      }

      const user = userOption.value;

      user.updateProfile({
        displayName: command.displayName ?? null,
        bio: command.bio ?? null,
        avatarUrl: command.avatarUrl ?? null,
        githubUrl: command.githubUrl ?? null,
        websiteUrl: command.websiteUrl ?? null,
        location: command.location ?? null,
        company: command.company ?? null,
      });

      const updatedUser = await this.userRepository.save(user);
      return Result.ok(updatedUser);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error(String(error)));
    }
  }
}