import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';
import { SearchRoadmapsQuery } from '@core/search/queries/search-roadmaps.query';
import { SearchPostsQuery } from '@core/search/queries/search-posts.query';
import { SearchUsersQuery } from '@core/search/queries/search-users.query';
import { AutocompleteQuery } from '@core/search/queries/autocomplete.query';
import { OptionalJwtAuthGuard } from '@infrastructure/auth/guards/optional-jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { Public } from '@common/decorators/public.decorator';
import {
  SearchQueryDto,
  SearchResultsDto,
  SearchType,
  AutocompleteResultDto,
} from './dto';
import { RoadmapSummaryDto } from '@api/roadmap/dto';
import { PostSummaryDto } from '@api/post/dto';
import { UserSummaryDto } from '@api/user/dto';
import { PaginatedResponseDto } from '@common/types/pagination.type';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly queryBus: QueryBus) {}

  @Public()
  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Search across all content types' })
  @ApiResponse({ status: 200, type: SearchResultsDto })
  async search(
    @Query() dto: SearchQueryDto,
    @CurrentUser('id') userId?: string,
  ): Promise<SearchResultsDto> {
    const pagination = { page: dto.page ?? 1, limit: dto.limit ?? 20 };
    const type = dto.type ?? SearchType.ALL;

    const results: SearchResultsDto = {
      roadmaps: [],
      roadmapsTotal: 0,
      posts: [],
      postsTotal: 0,
      users: [],
      usersTotal: 0,
    };

    if (type === SearchType.ALL || type === SearchType.ROADMAPS) {
      const roadmapQuery = new SearchRoadmapsQuery(dto.q, pagination, userId);
      const roadmapResults = await this.queryBus.execute(roadmapQuery);
      results.roadmaps = roadmapResults.items;
      results.roadmapsTotal = roadmapResults.total;
    }

    if (type === SearchType.ALL || type === SearchType.POSTS) {
      const postQuery = new SearchPostsQuery(dto.q, pagination, userId);
      const postResults = await this.queryBus.execute(postQuery);
      results.posts = postResults.items;
      results.postsTotal = postResults.total;
    }

    if (type === SearchType.ALL || type === SearchType.USERS) {
      const userQuery = new SearchUsersQuery(dto.q, pagination);
      const userResults = await this.queryBus.execute(userQuery);
      results.users = userResults.items;
      results.usersTotal = userResults.total;
    }

    return results;
  }

  @Public()
  @Get('roadmaps')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Search roadmaps' })
  @ApiQuery({ name: 'q', required: true, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, type: PaginatedResponseDto })
  async searchRoadmaps(
    @Query('q') q: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @CurrentUser('id') userId?: string,
  ): Promise<PaginatedResponseDto<RoadmapSummaryDto>> {
    const pagination = { page: page ?? 1, limit: limit ?? 20 };
    const query = new SearchRoadmapsQuery(q, pagination, userId);
    return this.queryBus.execute(query);
  }

  @Public()
  @Get('posts')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Search posts' })
  @ApiQuery({ name: 'q', required: true, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, type: PaginatedResponseDto })
  async searchPosts(
    @Query('q') q: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @CurrentUser('id') userId?: string,
  ): Promise<PaginatedResponseDto<PostSummaryDto>> {
    const pagination = { page: page ?? 1, limit: limit ?? 20 };
    const query = new SearchPostsQuery(q, pagination, userId);
    return this.queryBus.execute(query);
  }

  @Public()
  @Get('users')
  @ApiOperation({ summary: 'Search users' })
  @ApiQuery({ name: 'q', required: true, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, type: PaginatedResponseDto })
  async searchUsers(
    @Query('q') q: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<PaginatedResponseDto<UserSummaryDto>> {
    const pagination = { page: page ?? 1, limit: limit ?? 20 };
    const query = new SearchUsersQuery(q, pagination);
    return this.queryBus.execute(query);
  }

  @Public()
  @Get('autocomplete')
  @ApiOperation({ summary: 'Get autocomplete suggestions' })
  @ApiQuery({ name: 'q', required: true, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, type: [AutocompleteResultDto] })
  async autocomplete(
    @Query('q') q: string,
    @Query('limit') limit?: number,
  ): Promise<AutocompleteResultDto[]> {
    const query = new AutocompleteQuery(q, limit ?? 10);
    return this.queryBus.execute(query);
  }
}