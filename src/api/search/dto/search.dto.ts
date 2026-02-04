import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { RoadmapSummaryDto } from '@api/roadmap/dto';
import { PostSummaryDto } from '@api/post/dto';
import { UserSummaryDto } from '@api/user/dto';

export enum SearchType {
  ALL = 'all',
  ROADMAPS = 'roadmaps',
  POSTS = 'posts',
  USERS = 'users',
}

export class SearchQueryDto {
  @ApiProperty({ description: 'Search query string' })
  @IsString()
  q!: string;

  @ApiPropertyOptional({ enum: SearchType, default: SearchType.ALL })
  @IsOptional()
  @IsEnum(SearchType)
  type?: SearchType;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;
}

export class SearchResultsDto {
  @ApiProperty({ type: [RoadmapSummaryDto] })
  roadmaps!: RoadmapSummaryDto[];

  @ApiProperty()
  roadmapsTotal!: number;

  @ApiProperty({ type: [PostSummaryDto] })
  posts!: PostSummaryDto[];

  @ApiProperty()
  postsTotal!: number;

  @ApiProperty({ type: [UserSummaryDto] })
  users!: UserSummaryDto[];

  @ApiProperty()
  usersTotal!: number;
}

export class AutocompleteResultDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty({ enum: ['roadmap', 'post', 'user', 'tag'] })
  type!: string;

  @ApiPropertyOptional()
  subtitle?: string;

  @ApiPropertyOptional()
  imageUrl?: string;
}