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
import { CreatePostCommand } from '@core/post/commands/create-post.command';
import { UpdatePostCommand } from '@core/post/commands/update-post.command';
import { DeletePostCommand } from '@core/post/commands/delete-post.command';
import { PublishPostCommand } from '@core/post/commands/publish-post.command';
import { GetPostQuery } from '@core/post/queries/get-post.query';
import { ListPostsQuery } from '@core/post/queries/list-posts.query';
import { JwtAuthGuard } from '@infrastructure/auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '@infrastructure/auth/guards/optional-jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { Public } from '@common/decorators/public.decorator';
import {
  PostDto,
  PostSummaryDto,
  CreatePostDto,
  UpdatePostDto,
} from './dto';
import { PaginationDto, PaginatedResponseDto } from '@common/types/pagination.type';
import { PostType } from '@domain/post/enums';

@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Public()
  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'List all published posts' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'type', required: false, enum: PostType })
  @ApiQuery({ name: 'tags', required: false, type: [String] })
  @ApiQuery({ name: 'roadmapId', required: false, type: String })
  @ApiQuery({ name: 'sort', required: false, enum: ['latest', 'popular', 'trending'] })
  @ApiResponse({ status: 200, type: PaginatedResponseDto })
  async listPosts(
    @Query() pagination: PaginationDto,
    @Query('type') type?: PostType,
    @Query('tags') tags?: string[],
    @Query('roadmapId') roadmapId?: string,
    @Query('sort') sort?: 'latest' | 'popular' | 'trending',
    @CurrentUser('id') userId?: string,
  ): Promise<PaginatedResponseDto<PostSummaryDto>> {
    const query = new ListPostsQuery({
      pagination,
      type,
      tags,
      roadmapId,
      sort,
      userId,
    });
    return this.queryBus.execute(query);
  }

  @Public()
  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get post by ID' })
  @ApiResponse({ status: 200, type: PostDto })
  async getPost(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId?: string,
  ): Promise<PostDto> {
    const query = new GetPostQuery(id, userId);
    const result = await this.queryBus.execute(query);

    if (result.isNone()) {
      throw new Error('Post not found');
    }

    return result.unwrap();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ status: 201, type: PostDto })
  async createPost(
    @Body() dto: CreatePostDto,
    @CurrentUser('id') userId: string,
  ): Promise<PostDto> {
    const command = new CreatePostCommand(userId, dto);
    const result = await this.commandBus.execute(command);

    if (result.isFailure()) {
      throw result.getError();
    }

    return result.getValue();
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a post' })
  @ApiResponse({ status: 200, type: PostDto })
  async updatePost(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePostDto,
    @CurrentUser('id') userId: string,
  ): Promise<PostDto> {
    const command = new UpdatePostCommand(id, userId, dto);
    const result = await this.commandBus.execute(command);

    if (result.isFailure()) {
      throw result.getError();
    }

    return result.getValue();
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/publish')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Publish a draft post' })
  @ApiResponse({ status: 200, type: PostDto })
  async publishPost(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ): Promise<PostDto> {
    const command = new PublishPostCommand(id, userId);
    const result = await this.commandBus.execute(command);

    if (result.isFailure()) {
      throw result.getError();
    }

    return result.getValue();
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a post' })
  @ApiResponse({ status: 204 })
  async deletePost(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ): Promise<void> {
    const command = new DeletePostCommand(id, userId);
    const result = await this.commandBus.execute(command);

    if (result.isFailure()) {
      throw result.getError();
    }
  }

  @Public()
  @Get('user/:userId')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get posts by user' })
  @ApiResponse({ status: 200, type: PaginatedResponseDto })
  async getUserPosts(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query() pagination: PaginationDto,
    @CurrentUser('id') currentUserId?: string,
  ): Promise<PaginatedResponseDto<PostSummaryDto>> {
    const query = new ListPostsQuery({
      pagination,
      authorId: userId,
      userId: currentUserId,
    });
    return this.queryBus.execute(query);
  }
}