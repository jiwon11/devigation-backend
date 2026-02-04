import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { UserRole, UserStatus } from '@domain/user/enums';

export class AdminUserDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  username!: string;

  @ApiPropertyOptional()
  displayName?: string;

  @ApiProperty({ enum: UserRole })
  role!: UserRole;

  @ApiProperty({ enum: UserStatus })
  status!: UserStatus;

  @ApiProperty()
  isEmailVerified!: boolean;

  @ApiProperty()
  roadmapsCount!: number;

  @ApiProperty()
  postsCount!: number;

  @ApiProperty()
  followersCount!: number;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  lastLoginAt!: Date;

  @ApiPropertyOptional()
  bannedAt?: Date;

  @ApiPropertyOptional()
  banReason?: string;
}

export class UpdateUserRoleDto {
  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole)
  role!: UserRole;
}

export class UpdateUserStatusDto {
  @ApiProperty({ enum: UserStatus })
  @IsEnum(UserStatus)
  status!: UserStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reason?: string;
}

export class AdminUserListQueryDto {
  @ApiPropertyOptional({ enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ enum: UserStatus })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;
}
