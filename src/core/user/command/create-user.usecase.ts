import { Injectable, Inject } from '@nestjs/common';
import { Result } from '@common/types/result.type';
import { Option } from '@common/types/option.type';
import { User } from '@domain/user/user';
import { Email } from '@domain/user/email';
import { Username } from '@domain/user/username';
import {
  EmailAlreadyExistsException,
  UsernameAlreadyExistsException,
} from '@domain/user/user.exception';
import { CreateUserCommand } from './create-user.command';
import { USER_REPOSITORY, UserRepositoryPort } from '../port/out/user-repository.port';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(command: CreateUserCommand): Promise<Result<User, Error>> {
    try {
      // Check if email already exists
      const existingEmail = await this.userRepository.existsByEmail(
        Email.create(command.email),
      );
      if (existingEmail) {
        return Result.fail(new EmailAlreadyExistsException(command.email));
      }

      // Check if username already exists
      const existingUsername = await this.userRepository.existsByUsername(
        Username.create(command.username),
      );
      if (existingUsername) {
        return Result.fail(new UsernameAlreadyExistsException(command.username));
      }

      // Create user
      const user = User.create({
        email: command.email,
        username: command.username,
        provider: command.provider,
        providerId: command.providerId,
        profile: {
          displayName: command.displayName,
          avatarUrl: command.avatarUrl,
        },
      });

      // Save user
      const savedUser = await this.userRepository.save(user);
      return Result.ok(savedUser);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error(String(error)));
    }
  }
}