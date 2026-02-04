import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationType } from '@domain/interaction/enums';
import { UserSummaryDto } from '@api/user/dto';

export class LikeResponseDto {
  @ApiProperty()
  liked!: boolean;

  @ApiProperty()
  likeCount!: number;
}

export class BookmarkResponseDto {
  @ApiProperty()
  bookmarked!: boolean;

  @ApiProperty()
  bookmarkCount!: number;
}

export class NotificationDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: NotificationType })
  type!: NotificationType;

  @ApiProperty()
  message!: string;

  @ApiPropertyOptional({ type: UserSummaryDto })
  actor?: UserSummaryDto;

  @ApiPropertyOptional()
  targetId?: string;

  @ApiPropertyOptional()
  targetType?: string;

  @ApiProperty()
  isRead!: boolean;

  @ApiProperty()
  createdAt!: Date;
}

export class NotificationCountDto {
  @ApiProperty()
  unreadCount!: number;

  @ApiProperty()
  totalCount!: number;
}