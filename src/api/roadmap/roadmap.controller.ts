import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
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
import { CreateRoadmapCommand } from '@core/roadmap/commands/create-roadmap.command';
import { UpdateRoadmapCommand } from '@core/roadmap/commands/update-roadmap.command';
import { DeleteRoadmapCommand } from '@core/roadmap/commands/delete-roadmap.command';
import { ForkRoadmapCommand } from '@core/roadmap/commands/fork-roadmap.command';
import { PublishRoadmapCommand } from '@core/roadmap/commands/publish-roadmap.command';
import { GetRoadmapQuery } from '@core/roadmap/queries/get-roadmap.query';
import { ListRoadmapsQuery } from '@core/roadmap/queries/list-roadmaps.query';
import { GetUserRoadmapsQuery } from '@core/roadmap/queries/get-user-roadmaps.query';
import { JwtAuthGuard } from '@infrastructure/auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '@infrastructure/auth/guards/optional-jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { Public } from '@common/decorators/public.decorator';
import {
  RoadmapDto,
  RoadmapSummaryDto,
  CreateRoadmapDto,
  UpdateRoadmapDto,
  UpdateRoadmapGraphDto,
} from './dto';
import { PaginationDto, PaginatedResponseDto } from '@common/types/pagination.type';
import { DifficultyLevel } from '@domain/roadmap/enums';

@ApiTags('Roadmaps')
@Controller('roadmaps')
export class RoadmapController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Public()
  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'List all public roadmaps' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'difficulty', required: false, enum: DifficultyLevel })
  @ApiQuery({ name: 'tags', required: false, type: [String] })
  @ApiQuery({ name: 'sort', required: false, enum: ['latest', 'popular', 'trending'] })
  @ApiResponse({ status: 200, type: PaginatedResponseDto })
  async listRoadmaps(
    @Query() pagination: PaginationDto,
    @Query('difficulty') difficulty?: DifficultyLevel,
    @Query('tags') tags?: string[],
    @Query('sort') sort?: 'latest' | 'popular' | 'trending',
    @CurrentUser('id') userId?: string,
  ): Promise<PaginatedResponseDto<RoadmapSummaryDto>> {
    const query = new ListRoadmapsQuery({
      pagination,
      difficulty,
      tags,
      sort,
      userId,
    });
    return this.queryBus.execute(query);
  }

  @Public()
  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get roadmap by ID' })
  @ApiResponse({ status: 200, type: RoadmapDto })
  async getRoadmap(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId?: string,
  ): Promise<RoadmapDto> {
    const query = new GetRoadmapQuery(id, userId);
    const result = await this.queryBus.execute(query);

    if (result.isNone()) {
      throw new Error('Roadmap not found');
    }

    return result.unwrap();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new roadmap' })
  @ApiResponse({ status: 201, type: RoadmapDto })
  async createRoadmap(
    @Body() dto: CreateRoadmapDto,
    @CurrentUser('id') userId: string,
  ): Promise<RoadmapDto> {
    const command = new CreateRoadmapCommand(userId, dto);
    const result = await this.commandBus.execute(command);

    if (result.isFailure()) {
      throw result.getError();
    }

    return result.getValue();
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update roadmap metadata' })
  @ApiResponse({ status: 200, type: RoadmapDto })
  async updateRoadmap(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRoadmapDto,
    @CurrentUser('id') userId: string,
  ): Promise<RoadmapDto> {
    const command = new UpdateRoadmapCommand(id, userId, dto);
    const result = await this.commandBus.execute(command);

    if (result.isFailure()) {
      throw result.getError();
    }

    return result.getValue();
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/graph')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update roadmap nodes and edges' })
  @ApiResponse({ status: 200, type: RoadmapDto })
  async updateRoadmapGraph(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRoadmapGraphDto,
    @CurrentUser('id') userId: string,
  ): Promise<RoadmapDto> {
    const command = new UpdateRoadmapCommand(id, userId, undefined, dto);
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
  @ApiOperation({ summary: 'Publish a draft roadmap' })
  @ApiResponse({ status: 200, type: RoadmapDto })
  async publishRoadmap(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ): Promise<RoadmapDto> {
    const command = new PublishRoadmapCommand(id, userId);
    const result = await this.commandBus.execute(command);

    if (result.isFailure()) {
      throw result.getError();
    }

    return result.getValue();
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/fork')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Fork a roadmap' })
  @ApiResponse({ status: 201, type: RoadmapDto })
  async forkRoadmap(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ): Promise<RoadmapDto> {
    const command = new ForkRoadmapCommand(id, userId);
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
  @ApiOperation({ summary: 'Delete a roadmap' })
  @ApiResponse({ status: 204 })
  async deleteRoadmap(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ): Promise<void> {
    const command = new DeleteRoadmapCommand(id, userId);
    const result = await this.commandBus.execute(command);

    if (result.isFailure()) {
      throw result.getError();
    }
  }

  @Public()
  @Get('user/:userId')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get roadmaps by user' })
  @ApiResponse({ status: 200, type: PaginatedResponseDto })
  async getUserRoadmaps(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query() pagination: PaginationDto,
    @CurrentUser('id') currentUserId?: string,
  ): Promise<PaginatedResponseDto<RoadmapSummaryDto>> {
    const query = new GetUserRoadmapsQuery(userId, pagination, currentUserId);
    return this.queryBus.execute(query);
  }
}