import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ToggleLikeCommand } from '@core/interaction/commands/toggle-like.command';
import { ToggleBookmarkCommand } from '@core/interaction/commands/toggle-bookmark.command';
import { MarkNotificationReadCommand } from '@core/interaction/commands/mark-notification-read.command';
import { GetNotificationsQuery } from '@core/interaction/queries/get-notifications.query';
import { GetLikedItemsQuery } from '@core/interaction/queries/get-liked-items.query';
import { GetBookmarkedItemsQuery } from '@core/interaction/queries/get-bookmarked-items.query';
import { JwtAuthGuard } from '@infrastructure/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import {
  LikeResponseDto,
  BookmarkResponseDto,
  NotificationDto,
  NotificationCountDto,
} from './dto';
import { PaginationDto, PaginatedResponseDto } from '@common/types/pagination.type';

@ApiTags('Interactions')
@Controller()
export class InteractionController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  // Post likes
  @UseGuards(JwtAuthGuard)
  @Post('posts/:postId/like')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle like on a post' })
  @ApiResponse({ status: 200, type: LikeResponseDto })
  async togglePostLike(
    @Param('postId', ParseUUIDPipe) postId: string,
    @CurrentUser('id') userId: string,
  ): Promise<LikeResponseDto> {
    const command = new ToggleLikeCommand('post', postId, userId);
    const result = await this.commandBus.execute(command);

    if (result.isFailure()) {
      throw result.getError();
    }

    return result.getValue();
  }

  // Post bookmarks
  @UseGuards(JwtAuthGuard)
  @Post('posts/:postId/bookmark')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle bookmark on a post' })
  @ApiResponse({ status: 200, type: BookmarkResponseDto })
  async togglePostBookmark(
    @Param('postId', ParseUUIDPipe) postId: string,
    @CurrentUser('id') userId: string,
  ): Promise<BookmarkResponseDto> {
    const command = new ToggleBookmarkCommand('post', postId, userId);
    const result = await this.commandBus.execute(command);

    if (result.isFailure()) {
      throw result.getError();
    }

    return result.getValue();
  }

  // Roadmap likes
  @UseGuards(JwtAuthGuard)
  @Post('roadmaps/:roadmapId/like')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle like on a roadmap' })
  @ApiResponse({ status: 200, type: LikeResponseDto })
  async toggleRoadmapLike(
    @Param('roadmapId', ParseUUIDPipe) roadmapId: string,
    @CurrentUser('id') userId: string,
  ): Promise<LikeResponseDto> {
    const command = new ToggleLikeCommand('roadmap', roadmapId, userId);
    const result = await this.commandBus.execute(command);

    if (result.isFailure()) {
      throw result.getError();
    }

    return result.getValue();
  }

  // Roadmap bookmarks
  @UseGuards(JwtAuthGuard)
  @Post('roadmaps/:roadmapId/bookmark')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle bookmark on a roadmap' })
  @ApiResponse({ status: 200, type: BookmarkResponseDto })
  async toggleRoadmapBookmark(
    @Param('roadmapId', ParseUUIDPipe) roadmapId: string,
    @CurrentUser('id') userId: string,
  ): Promise<BookmarkResponseDto> {
    const command = new ToggleBookmarkCommand('roadmap', roadmapId, userId);
    const result = await this.commandBus.execute(command);

    if (result.isFailure()) {
      throw result.getError();
    }

    return result.getValue();
  }

  // Comment likes
  @UseGuards(JwtAuthGuard)
  @Post('comments/:commentId/like')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle like on a comment' })
  @ApiResponse({ status: 200, type: LikeResponseDto })
  async toggleCommentLike(
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @CurrentUser('id') userId: string,
  ): Promise<LikeResponseDto> {
    const command = new ToggleLikeCommand('comment', commentId, userId);
    const result = await this.commandBus.execute(command);

    if (result.isFailure()) {
      throw result.getError();
    }

    return result.getValue();
  }

  // Notifications
  @UseGuards(JwtAuthGuard)
  @Get('notifications')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user notifications' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'unreadOnly', required: false, type: Boolean })
  @ApiResponse({ status: 200, type: PaginatedResponseDto })
  async getNotifications(
    @Query() pagination: PaginationDto,
    @Query('unreadOnly') unreadOnly?: boolean,
    @CurrentUser('id') userId?: string,
  ): Promise<PaginatedResponseDto<NotificationDto>> {
    const query = new GetNotificationsQuery(userId!, pagination, unreadOnly);
    return this.queryBus.execute(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('notifications/count')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get notification counts' })
  @ApiResponse({ status: 200, type: NotificationCountDto })
  async getNotificationCount(
    @CurrentUser('id') userId: string,
  ): Promise<NotificationCountDto> {
    const query = new GetNotificationsQuery(userId, { page: 1, limit: 1 }, false, true);
    return this.queryBus.execute(query);
  }

  @UseGuards(JwtAuthGuard)
  @Put('notifications/:id/read')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiResponse({ status: 204 })
  async markNotificationRead(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ): Promise<void> {
    const command = new MarkNotificationReadCommand(id, userId);
    const result = await this.commandBus.execute(command);

    if (result.isFailure()) {
      throw result.getError();
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('notifications/read-all')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({ status: 204 })
  async markAllNotificationsRead(
    @CurrentUser('id') userId: string,
  ): Promise<void> {
    const command = new MarkNotificationReadCommand(null, userId, true);
    const result = await this.commandBus.execute(command);

    if (result.isFailure()) {
      throw result.getError();
    }
  }

  // User's liked and bookmarked items
  @UseGuards(JwtAuthGuard)
  @Get('me/likes')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get items liked by current user' })
  @ApiQuery({ name: 'type', required: false, enum: ['post', 'roadmap', 'comment'] })
  @ApiResponse({ status: 200, type: PaginatedResponseDto })
  async getLikedItems(
    @Query() pagination: PaginationDto,
    @Query('type') type?: 'post' | 'roadmap' | 'comment',
    @CurrentUser('id') userId?: string,
  ): Promise<PaginatedResponseDto<any>> {
    const query = new GetLikedItemsQuery(userId!, pagination, type);
    return this.queryBus.execute(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/bookmarks')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get items bookmarked by current user' })
  @ApiQuery({ name: 'type', required: false, enum: ['post', 'roadmap'] })
  @ApiResponse({ status: 200, type: PaginatedResponseDto })
  async getBookmarkedItems(
    @Query() pagination: PaginationDto,
    @Query('type') type?: 'post' | 'roadmap',
    @CurrentUser('id') userId?: string,
  ): Promise<PaginatedResponseDto<any>> {
    const query = new GetBookmarkedItemsQuery(userId!, pagination, type);
    return this.queryBus.execute(query);
  }
}