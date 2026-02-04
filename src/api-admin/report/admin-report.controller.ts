import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '@infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { UserRole } from '@domain/user/enums';
import { PaginationDto, PaginatedResponseDto } from '@common/types/pagination.type';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserSummaryDto } from '@api/user/dto';

enum ReportStatus {
  PENDING = 'pending',
  REVIEWING = 'reviewing',
  RESOLVED = 'resolved',
  DISMISSED = 'dismissed',
}

enum ReportType {
  SPAM = 'spam',
  HARASSMENT = 'harassment',
  INAPPROPRIATE = 'inappropriate',
  COPYRIGHT = 'copyright',
  OTHER = 'other',
}

class ReportDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: ReportType })
  type!: ReportType;

  @ApiProperty()
  targetType!: string;

  @ApiProperty()
  targetId!: string;

  @ApiProperty()
  reason!: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ type: UserSummaryDto })
  reporter!: UserSummaryDto;

  @ApiProperty({ enum: ReportStatus })
  status!: ReportStatus;

  @ApiProperty()
  createdAt!: Date;

  @ApiPropertyOptional()
  resolvedAt?: Date;

  @ApiPropertyOptional()
  resolvedBy?: string;

  @ApiPropertyOptional()
  resolution?: string;
}

class ReportListQueryDto {
  @ApiPropertyOptional({ enum: ReportStatus })
  @IsOptional()
  @IsEnum(ReportStatus)
  status?: ReportStatus;

  @ApiPropertyOptional({ enum: ReportType })
  @IsOptional()
  @IsEnum(ReportType)
  type?: ReportType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  targetType?: string;
}

class ResolveReportDto {
  @ApiProperty({ enum: ReportStatus })
  @IsEnum(ReportStatus)
  status!: ReportStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  resolution?: string;
}

@ApiTags('Admin - Reports')
@Controller('admin/reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.MODERATOR)
@ApiBearerAuth()
export class AdminReportController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all reports' })
  @ApiResponse({ status: 200, type: PaginatedResponseDto })
  async listReports(
    @Query() pagination: PaginationDto,
    @Query() filters: ReportListQueryDto,
  ): Promise<PaginatedResponseDto<ReportDto>> {
    return {
      items: [],
      total: 0,
      page: pagination.page ?? 1,
      limit: pagination.limit ?? 20,
      totalPages: 0,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get report details' })
  @ApiResponse({ status: 200, type: ReportDto })
  async getReport(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ReportDto> {
    throw new Error('Not implemented');
  }

  @Put(':id/resolve')
  @ApiOperation({ summary: 'Resolve a report' })
  @ApiResponse({ status: 200, type: ReportDto })
  async resolveReport(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ResolveReportDto,
  ): Promise<ReportDto> {
    throw new Error('Not implemented');
  }
}
