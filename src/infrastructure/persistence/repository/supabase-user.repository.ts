import { Injectable } from '@nestjs/common';
import { Option } from '@common/types/option.type';
import { Paginated, Pagination, PaginationParams } from '@common/types/pagination.type';
import { User } from '@domain/user/user';
import { UserId } from '@domain/user/user-id';
import { Email } from '@domain/user/email';
import { Username } from '@domain/user/username';
import { UserRepositoryPort } from '@core/user/port/out/user-repository.port';
import { SupabaseService } from '@infrastructure/supabase/supabase.service';
import { UserMapper, UserRow } from '../mapper/user.mapper';

@Injectable()
export class SupabaseUserRepository implements UserRepositoryPort {
  constructor(private readonly supabase: SupabaseService) {}

  async save(user: User): Promise<User> {
    const data = UserMapper.toPersistence(user);
    const { error } = await this.supabase
      .getAdminClient()
      .from('users')
      .upsert(data)
      .select()
      .single();

    if (error !== null) {
      throw new Error(`Failed to save user: ${error.message}`);
    }

    return user;
  }

  async findById(id: UserId): Promise<Option<User>> {
    const { data, error } = await this.supabase
      .getClient()
      .from('users')
      .select('*')
      .eq('id', id.value)
      .single();

    if (error !== null || data === null) {
      return Option.none();
    }

    return Option.some(UserMapper.toDomain(data as UserRow));
  }

  async findByEmail(email: Email): Promise<Option<User>> {
    const { data, error } = await this.supabase
      .getClient()
      .from('users')
      .select('*')
      .eq('email', email.value)
      .single();

    if (error !== null || data === null) {
      return Option.none();
    }

    return Option.some(UserMapper.toDomain(data as UserRow));
  }

  async findByUsername(username: Username): Promise<Option<User>> {
    const { data, error } = await this.supabase
      .getClient()
      .from('users')
      .select('*')
      .eq('username', username.value)
      .single();

    if (error !== null || data === null) {
      return Option.none();
    }

    return Option.some(UserMapper.toDomain(data as UserRow));
  }

  async findByProviderId(provider: string, providerId: string): Promise<Option<User>> {
    const { data, error } = await this.supabase
      .getClient()
      .from('users')
      .select('*')
      .contains('providers', [provider])
      .eq('provider_id', providerId)
      .single();

    if (error !== null || data === null) {
      return Option.none();
    }

    return Option.some(UserMapper.toDomain(data as UserRow));
  }

  async findAll(params: PaginationParams): Promise<Paginated<User>> {
    const offset = Pagination.getOffset(params);
    const { data, error, count } = await this.supabase
      .getClient()
      .from('users')
      .select('*', { count: 'exact' })
      .range(offset, offset + params.limit - 1)
      .order('created_at', { ascending: false });

    if (error !== null) {
      throw new Error(`Failed to find users: ${error.message}`);
    }

    const users = (data ?? []).map((row) => UserMapper.toDomain(row as UserRow));
    return Pagination.create(users, params, count ?? 0);
  }

  async delete(id: UserId): Promise<void> {
    const { error } = await this.supabase
      .getAdminClient()
      .from('users')
      .delete()
      .eq('id', id.value);

    if (error !== null) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  async existsByEmail(email: Email): Promise<boolean> {
    const { count, error } = await this.supabase
      .getClient()
      .from('users')
      .select('id', { count: 'exact', head: true })
      .eq('email', email.value);

    if (error !== null) {
      return false;
    }

    return (count ?? 0) > 0;
  }

  async existsByUsername(username: Username): Promise<boolean> {
    const { count, error } = await this.supabase
      .getClient()
      .from('users')
      .select('id', { count: 'exact', head: true })
      .eq('username', username.value);

    if (error !== null) {
      return false;
    }

    return (count ?? 0) > 0;
  }
}