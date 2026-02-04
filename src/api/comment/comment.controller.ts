import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
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
import { AddCommentCommand } from '@core/comment/commands/add-comment.command';
import { UpdateCommentCommand } from '@core/comment/commands/update-comment.command';
import { DeleteCommentCommand } from '@core/comment/commands/delete-comment.command';
import { GetCommentsQuery } from '@core/comment/queries/get-comments.query';
import { JwtAuthGuard } from '@infrastructure/auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '@infrastructure/auth/guards/optional-jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { Public } from '@common/decorators/public.decorator';
import {
  CommentDto,
  CommentTreeDto,
  CreateCommentDto,
  UpdateCommentDto,
} from './dto';
import { PaginationDto, PaginatedResponseDto } from '@common/types/pagination.type';

@ApiTags('Comments')
@Controller()
export class CommentController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  // Post comments
  @Public()
  @Get('posts/:postId/comments')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get comments for a post' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, type: CommentTreeDto })
  async getPostComments(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Query() pagination: PaginationDto,
    @CurrentUser('id') userId?: string,
  ): Promise<CommentTreeDto> {
    const query = new GetCommentsQuery('post', postId, pagination, userId);
    return this.queryBus.execute(query);
  }

  @UseGuards(JwtAuthGuard)
  @Post('posts/:postId/comments')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a comment to a post' })
  @ApiResponse({ status: 201, type: CommentDto })
  async addPostComment(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() dto: CreateCommentDto,
    @CurrentUser('id') userId: string,
  ): Promise<CommentDto> {
    const command = new AddCommentCommand('post', postId, userId, dto.content, dto.parentId);
    const result = await this.commandBus.execute(command);

    if (result.isFailure()) {
      throw result.getError();
    }

    return result.getValue();
  }

  // Roadmap comments
  @Public()
  @Get('roadmaps/:roadmapId/comments')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get comments for a roadmap' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, type: CommentTreeDto })
  async getRoadmapComments(
    @Param('roadmapId', ParseUUIDPipe) roadmapId: string,
    @Query() pagination: PaginationDto,
    @CurrentUser('id') userId?: string,
  ): Promise<CommentTreeDto> {
    const query = new GetCommentsQuery('roadmap', roadmapId, pagination, userId);
    return this.queryBus.execute(query);
  }

  @UseGuards(JwtAuthGuard)
  @Post('roadmaps/:roadmapId/comments')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a comment to a roadmap' })
  @ApiResponse({ status: 201, type: CommentDto })
  async addRoadmapComment(
    @Param('roadmapId', ParseUUIDPipe) roadmapId: string,
    @Body() dto: CreateCommentDto,
    @CurrentUser('id') userId: string,
  ): Promise<CommentDto> {
    const command = new AddCommentCommand('roadmap', roadmapId, userId, dto.content, dto.parentId);
    const result = await this.commandBus.execute(command);

    if (result.isFailure()) {
      throw result.getError();
    }

    return result.getValue();
  }

  // Comment management
  @UseGuards(JwtAuthGuard)
  @Put('comments/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a comment' })
  @ApiResponse({ status: 200, type: CommentDto })
  async updateComment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCommentDto,
    @CurrentUser('id') userId: string,
  ): Promise<CommentDto> {
    const command = new UpdateCommentCommand(id, userId, dto.content);
    const result = await this.commandBus.execute(command);

    if (result.isFailure()) {
      throw result.getError();
    }

    return result.getValue();
  }

  @UseGuards(JwtAuthGuard)
  @Delete('comments/:id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({ status: 204 })
  async deleteComment(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ): Promise<void> {
    const command = new DeleteCommentCommand(id, userId);
    const result = await this.commandBus.execute(command);

    if (result.isFailure()) {
      throw result.getError();
    }
  }
}