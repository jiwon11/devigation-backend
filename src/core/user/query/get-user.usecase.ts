import { Injectable, Inject } from '@nestjs/common';
import { Result } from '@common/types/result.type';
import { Option } from '@common/types/option.type';
import { User } from '@domain/user/user';
import { UserId } from '@domain/user/user-id';
import { Email } from '@domain/user/email';
import { Username } from '@domain/user/username';
import { UserNotFoundException } from '@domain/user/user.exception';
import { GetUserQuery, GetUserByUsernameQuery, GetUserByEmailQuery } from './get-user.query';
import { USER_REPOSITORY, UserRepositoryPort } from '../port/out/user-repository.port';

@Injectable()
export class GetUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(query: GetUserQuery): Promise<Result<User, Error>> {
    try {
      const userId = UserId.create(query.userId);
      const userOption = await this.userRepository.findById(userId);

      if (!Option.isSome(userOption)) {
        return Result.fail(new UserNotFoundException(query.userId));
      }

      return Result.ok(userOption.value);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error(String(error)));
    }
  }

  async executeByUsername(query: GetUserByUsernameQuery): Promise<Result<User, Error>> {
    try {
      const username = Username.create(query.username);
      const userOption = await this.userRepository.findByUsername(username);

      if (!Option.isSome(userOption)) {
        return Result.fail(new UserNotFoundException());
      }

      return Result.ok(userOption.value);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error(String(error)));
    }
  }

  async executeByEmail(query: GetUserByEmailQuery): Promise<Result<User, Error>> {
    try {
      const email = Email.create(query.email);
      const userOption = await this.userRepository.findByEmail(email);

      if (!Option.isSome(userOption)) {
        return Result.fail(new UserNotFoundException());
      }

      return Result.ok(userOption.value);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error(String(error)));
    }
  }
}