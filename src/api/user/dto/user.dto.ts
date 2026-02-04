import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole, UserStatus } from '@domain/user/enums';

export class UserProfileDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  username!: string;

  @ApiPropertyOptional()
  displayName?: string;

  @ApiPropertyOptional()
  bio?: string;

  @ApiPropertyOptional()
  avatarUrl?: string;

  @ApiPropertyOptional()
  website?: string;

  @ApiPropertyOptional()
  location?: string;

  @ApiPropertyOptional()
  company?: string;

  @ApiProperty({ enum: UserRole })
  role!: UserRole;

  @ApiProperty({ enum: UserStatus })
  status!: UserStatus;

  @ApiProperty()
  followersCount!: number;

  @ApiProperty()
  followingCount!: number;

  @ApiProperty()
  roadmapsCount!: number;

  @ApiProperty()
  postsCount!: number;

  @ApiProperty()
  isEmailVerified!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiPropertyOptional()
  isFollowing?: boolean;

  @ApiPropertyOptional()
  isFollowedBy?: boolean;
}

export class UserSummaryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  username!: string;

  @ApiPropertyOptional()
  displayName?: string;

  @ApiPropertyOptional()
  avatarUrl?: string;

  @ApiPropertyOptional()
  bio?: string;
}

export class UserStatsDto {
  @ApiProperty()
  followersCount!: number;

  @ApiProperty()
  followingCount!: number;

  @ApiProperty()
  roadmapsCount!: number;

  @ApiProperty()
  postsCount!: number;

  @ApiProperty()
  totalLikesReceived!: number;

  @ApiProperty()
  totalBookmarks!: number;
}
