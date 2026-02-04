import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserSummaryDto } from '@api/user/dto';

export class CommentDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  content!: string;

  @ApiProperty({ type: UserSummaryDto })
  author!: UserSummaryDto;

  @ApiPropertyOptional()
  parentId?: string;

  @ApiProperty()
  likeCount!: number;

  @ApiProperty()
  replyCount!: number;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiPropertyOptional()
  isLiked?: boolean;

  @ApiPropertyOptional()
  isAuthor?: boolean;

  @ApiPropertyOptional({ type: [CommentDto] })
  replies?: CommentDto[];
}

export class CommentTreeDto {
  @ApiProperty({ type: [CommentDto] })
  comments!: CommentDto[];

  @ApiProperty()
  totalCount!: number;
}