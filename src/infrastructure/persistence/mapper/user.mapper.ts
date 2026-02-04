import { User } from '@domain/user/user';
import { UserId } from '@domain/user/user-id';
import { Email } from '@domain/user/email';
import { Username } from '@domain/user/username';
import { Profile } from '@domain/user/profile';
import { AuthProvider, UserRole, UserStatus } from '@domain/user/user.enum';

export interface UserRow {
  id: string;
  email: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  github_url: string | null;
  website_url: string | null;
  location: string | null;
  company: string | null;
  role: string;
  status: string;
  providers: string[];
  provider_id: string | null;
  follower_count: number;
  following_count: number;
  roadmap_count: number;
  post_count: number;
  created_at: string;
  updated_at: string;
}

export class UserMapper {
  static toDomain(row: UserRow): User {
    return User.reconstitute(
      UserId.create(row.id),
      {
        email: Email.create(row.email),
        username: Username.create(row.username),
        profile: Profile.create({
          displayName: row.display_name,
          bio: row.bio,
          avatarUrl: row.avatar_url,
          githubUrl: row.github_url,
          websiteUrl: row.website_url,
          location: row.location,
          company: row.company,
        }),
        role: row.role as UserRole,
        status: row.status as UserStatus,
        providers: row.providers.map((p) => p as AuthProvider),
        providerId: row.provider_id,
        followerCount: row.follower_count,
        followingCount: row.following_count,
        roadmapCount: row.roadmap_count,
        postCount: row.post_count,
      },
      new Date(row.created_at),
    );
  }

  static toPersistence(user: User): Omit<UserRow, 'created_at' | 'updated_at'> {
    return {
      id: user.id.value,
      email: user.email.value,
      username: user.username.value,
      display_name: user.profile.displayName,
      bio: user.profile.bio,
      avatar_url: user.profile.avatarUrl,
      github_url: user.profile.githubUrl,
      website_url: user.profile.websiteUrl,
      location: user.profile.location,
      company: user.profile.company,
      role: user.role,
      status: user.status,
      providers: [...user.providers],
      provider_id: user.providerId,
      follower_count: user.followerCount,
      following_count: user.followingCount,
      roadmap_count: user.roadmapCount,
      post_count: user.postCount,
    };
  }
}