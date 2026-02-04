import { Option } from '@common/types/option.type';
import { User } from '@domain/user/user';
import { UserId } from '@domain/user/user-id';
import { Email } from '@domain/user/email';
import { Username } from '@domain/user/username';
import { PaginationParams, Paginated } from '@common/types/pagination.type';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UserRepositoryPort {
  save(user: User): Promise<User>;
  findById(id: UserId): Promise<Option<User>>;
  findByEmail(email: Email): Promise<Option<User>>;
  findByUsername(username: Username): Promise<Option<User>>;
  findByProviderId(provider: string, providerId: string): Promise<Option<User>>;
  findAll(params: PaginationParams): Promise<Paginated<User>>;
  delete(id: UserId): Promise<void>;
  existsByEmail(email: Email): Promise<boolean>;
  existsByUsername(username: Username): Promise<boolean>;
}