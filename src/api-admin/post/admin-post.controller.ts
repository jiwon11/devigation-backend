import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
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
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '@infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { UserRole } from '@domain/user/enums';
import { PostStatus } from '@domain/post/enums';
import { PaginationDto, PaginatedResponseDto } from '@common/types/pagination.type';
import { PostDto } from '@api/post/dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';

class AdminPostListQueryDto {
  @ApiPropertyOptional({ enum: PostStatus })
  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;
}

class UpdatePostStatusDto {
  @ApiPropertyOptional({ enum: PostStatus })
  @IsEnum(PostStatus)
  status!: PostStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reason?: string;
}

@ApiTags('Admin - Posts')
@Controller('admin/posts')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.MODERATOR)
@ApiBearerAuth()
export class AdminPostController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all posts (admin)' })
  @ApiResponse({ status: 200, type: PaginatedResponseDto })
  async listPosts(
    @Query() pagination: PaginationDto,
    @Query() filters: AdminPostListQueryDto,
  ): Promise<PaginatedResponseDto<PostDto>> {
    return {
      items: [],
      total: 0,
      page: pagination.page ?? 1,
      limit: pagination.limit ?? 20,
      totalPages: 0,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get post details (admin)' })
  @ApiResponse({ status: 200, type: PostDto })
  async getPost(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PostDto> {
    throw new Error('Not implemented');
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update post status (approve/reject/archive)' })
  @ApiResponse({ status: 200, type: PostDto })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePostStatusDto,
  ): Promise<PostDto> {
    throw new Error('Not implemented');
  }

  @Put(':id/feature')
  @ApiOperation({ summary: 'Feature/unfeature a post' })
  @ApiResponse({ status: 200, type: PostDto })
  async toggleFeatured(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PostDto> {
    throw new Error('Not implemented');
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete post permanently' })
  @ApiResponse({ status: 204 })
  async deletePost(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    throw new Error('Not implemented');
  }
}
