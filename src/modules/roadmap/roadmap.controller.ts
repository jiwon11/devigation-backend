import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RoadmapService } from './roadmap.service';
import { CreateRoadmapDto } from './dto/create-roadmap.dto';
import { UpdateRoadmapDto } from './dto/update-roadmap.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('roadmaps')
@Controller('roadmaps')
export class RoadmapController {
  constructor(private readonly roadmapService: RoadmapService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '로드맵 생성' })
  create(@CurrentUser() user: CurrentUserPayload, @Body() createRoadmapDto: CreateRoadmapDto) {
    return this.roadmapService.create(user.id, createRoadmapDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: '로드맵 목록 조회' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(
    @Query('category') category?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.roadmapService.findAll({ category, page, limit });
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: '로드맵 상세 조회' })
  findOne(@Param('id') id: string) {
    return this.roadmapService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '로드맵 수정' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserPayload,
    @Body() updateRoadmapDto: UpdateRoadmapDto,
  ) {
    return this.roadmapService.update(id, user.id, updateRoadmapDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '로드맵 삭제' })
  remove(@Param('id') id: string, @CurrentUser() user: CurrentUserPayload) {
    return this.roadmapService.remove(id, user.id);
  }

  @Post(':id/fork')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '로드맵 Fork' })
  fork(@Param('id') id: string, @CurrentUser() user: CurrentUserPayload) {
    return this.roadmapService.fork(id, user.id);
  }

  @Post(':id/star')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '로드맵 Star 토글' })
  star(@Param('id') id: string, @CurrentUser() user: CurrentUserPayload) {
    return this.roadmapService.star(id, user.id);
  }
}
