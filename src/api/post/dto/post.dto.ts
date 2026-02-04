import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PostStatus, PostType } from '@domain/post/enums';
import { UserSummaryDto } from '@api/user/dto';

export class PostDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  content!: string;

  @ApiPropertyOptional()
  excerpt?: string;

  @ApiPropertyOptional()
  thumbnailUrl?: string;

  @ApiProperty({ enum: PostType })
  type!: PostType;

  @ApiProperty({ enum: PostStatus })
  status!: PostStatus;

  @ApiProperty({ type: [String] })
  tags!: string[];

  @ApiProperty({ type: UserSummaryDto })
  author!: UserSummaryDto;

  @ApiPropertyOptional()
  roadmapId?: string;

  @ApiPropertyOptional()
  roadmapNodeId?: string;

  @ApiProperty()
  readTime!: number;

  @ApiProperty()
  viewCount!: number;

  @ApiProperty()
  likeCount!: number;

  @ApiProperty()
  bookmarkCount!: number;

  @ApiProperty()
  commentCount!: number;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiPropertyOptional()
  publishedAt?: Date;

  @ApiPropertyOptional()
  isLiked?: boolean;

  @ApiPropertyOptional()
  isBookmarked?: boolean;
}

export class PostSummaryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiPropertyOptional()
  excerpt?: string;

  @ApiPropertyOptional()
  thumbnailUrl?: string;

  @ApiProperty({ enum: PostType })
  type!: PostType;

  @ApiProperty({ type: [String] })
  tags!: string[];

  @ApiProperty({ type: UserSummaryDto })
  author!: UserSummaryDto;

  @ApiProperty()
  readTime!: number;

  @ApiProperty()
  viewCount!: number;

  @ApiProperty()
  likeCount!: number;

  @ApiProperty()
  commentCount!: number;

  @ApiProperty()
  createdAt!: Date;
}