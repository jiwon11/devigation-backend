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
} from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '@infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { UserRole } from '@domain/user/enums';
import { RoadmapStatus, RoadmapVisibility } from '@domain/roadmap/enums';
import { PaginationDto, PaginatedResponseDto } from '@common/types/pagination.type';
import { RoadmapDto } from '@api/roadmap/dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

class AdminRoadmapListQueryDto {
  @ApiPropertyOptional({ enum: RoadmapStatus })
  @IsOptional()
  @IsEnum(RoadmapStatus)
  status?: RoadmapStatus;

  @ApiPropertyOptional({ enum: RoadmapVisibility })
  @IsOptional()
  @IsEnum(RoadmapVisibility)
  visibility?: RoadmapVisibility;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;
}

class UpdateRoadmapStatusDto {
  @ApiPropertyOptional({ enum: RoadmapStatus })
  @IsEnum(RoadmapStatus)
  status!: RoadmapStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reason?: string;
}

@ApiTags('Admin - Roadmaps')
@Controller('admin/roadmaps')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.MODERATOR)
@ApiBearerAuth()
export class AdminRoadmapController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all roadmaps (admin)' })
  @ApiResponse({ status: 200, type: PaginatedResponseDto })
  async listRoadmaps(
    @Query() pagination: PaginationDto,
    @Query() filters: AdminRoadmapListQueryDto,
  ): Promise<PaginatedResponseDto<RoadmapDto>> {
    return {
      items: [],
      total: 0,
      page: pagination.page ?? 1,
      limit: pagination.limit ?? 20,
      totalPages: 0,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get roadmap details (admin)' })
  @ApiResponse({ status: 200, type: RoadmapDto })
  async getRoadmap(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<RoadmapDto> {
    throw new Error('Not implemented');
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update roadmap status (approve/reject/archive)' })
  @ApiResponse({ status: 200, type: RoadmapDto })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRoadmapStatusDto,
  ): Promise<RoadmapDto> {
    throw new Error('Not implemented');
  }

  @Put(':id/feature')
  @ApiOperation({ summary: 'Feature/unfeature a roadmap' })
  @ApiResponse({ status: 200, type: RoadmapDto })
  async toggleFeatured(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<RoadmapDto> {
    throw new Error('Not implemented');
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete roadmap permanently' })
  @ApiResponse({ status: 204 })
  async deleteRoadmap(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    throw new Error('Not implemented');
  }
}
