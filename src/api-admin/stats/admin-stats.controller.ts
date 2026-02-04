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
  ApiBearerAuth,
  ApiProperty,
  ApiPropertyOptional,
  ApiQuery,
} from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '@infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { UserRole } from '@domain/user/enums';

class DashboardStatsDto {
  @ApiProperty()
  totalUsers!: number;

  @ApiProperty()
  activeUsers!: number;

  @ApiProperty()
  newUsersToday!: number;

  @ApiProperty()
  newUsersThisWeek!: number;

  @ApiProperty()
  totalRoadmaps!: number;

  @ApiProperty()
  publishedRoadmaps!: number;

  @ApiProperty()
  newRoadmapsToday!: number;

  @ApiProperty()
  totalPosts!: number;

  @ApiProperty()
  publishedPosts!: number;

  @ApiProperty()
  newPostsToday!: number;

  @ApiProperty()
  totalComments!: number;

  @ApiProperty()
  pendingReports!: number;
}

class TimeSeriesDataPointDto {
  @ApiProperty()
  date!: string;

  @ApiProperty()
  value!: number;
}

class GrowthStatsDto {
  @ApiProperty({ type: [TimeSeriesDataPointDto] })
  users!: TimeSeriesDataPointDto[];

  @ApiProperty({ type: [TimeSeriesDataPointDto] })
  roadmaps!: TimeSeriesDataPointDto[];

  @ApiProperty({ type: [TimeSeriesDataPointDto] })
  posts!: TimeSeriesDataPointDto[];

  @ApiProperty({ type: [TimeSeriesDataPointDto] })
  interactions!: TimeSeriesDataPointDto[];
}

class TopContentDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  authorName!: string;

  @ApiProperty()
  viewCount!: number;

  @ApiProperty()
  likeCount!: number;
}

@ApiTags('Admin - Statistics')
@Controller('admin/stats')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AdminStatsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard overview statistics' })
  @ApiResponse({ status: 200, type: DashboardStatsDto })
  async getDashboardStats(): Promise<DashboardStatsDto> {
    return {
      totalUsers: 0,
      activeUsers: 0,
      newUsersToday: 0,
      newUsersThisWeek: 0,
      totalRoadmaps: 0,
      publishedRoadmaps: 0,
      newRoadmapsToday: 0,
      totalPosts: 0,
      publishedPosts: 0,
      newPostsToday: 0,
      totalComments: 0,
      pendingReports: 0,
    };
  }

  @Get('growth')
  @ApiOperation({ summary: 'Get growth statistics over time' })
  @ApiQuery({ name: 'period', required: false, enum: ['7d', '30d', '90d', '1y'] })
  @ApiResponse({ status: 200, type: GrowthStatsDto })
  async getGrowthStats(
    @Query('period') period?: '7d' | '30d' | '90d' | '1y',
  ): Promise<GrowthStatsDto> {
    return {
      users: [],
      roadmaps: [],
      posts: [],
      interactions: [],
    };
  }

  @Get('top-roadmaps')
  @ApiOperation({ summary: 'Get top performing roadmaps' })
  @ApiQuery({ name: 'period', required: false, enum: ['7d', '30d', '90d', 'all'] })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, type: [TopContentDto] })
  async getTopRoadmaps(
    @Query('period') period?: '7d' | '30d' | '90d' | 'all',
    @Query('limit') limit?: number,
  ): Promise<TopContentDto[]> {
    return [];
  }

  @Get('top-posts')
  @ApiOperation({ summary: 'Get top performing posts' })
  @ApiQuery({ name: 'period', required: false, enum: ['7d', '30d', '90d', 'all'] })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, type: [TopContentDto] })
  async getTopPosts(
    @Query('period') period?: '7d' | '30d' | '90d' | 'all',
    @Query('limit') limit?: number,
  ): Promise<TopContentDto[]> {
    return [];
  }
}
