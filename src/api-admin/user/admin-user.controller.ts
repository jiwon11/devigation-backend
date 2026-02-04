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
import {
  AdminUserDto,
  AdminUserListQueryDto,
  UpdateUserRoleDto,
  UpdateUserStatusDto,
} from './dto';
import { PaginationDto, PaginatedResponseDto } from '@common/types/pagination.type';

@ApiTags('Admin - Users')
@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AdminUserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all users (admin)' })
  @ApiResponse({ status: 200, type: PaginatedResponseDto })
  async listUsers(
    @Query() pagination: PaginationDto,
    @Query() filters: AdminUserListQueryDto,
  ): Promise<PaginatedResponseDto<AdminUserDto>> {
    // Implementation will use admin-specific query
    return {
      items: [],
      total: 0,
      page: pagination.page ?? 1,
      limit: pagination.limit ?? 20,
      totalPages: 0,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user details (admin)' })
  @ApiResponse({ status: 200, type: AdminUserDto })
  async getUser(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<AdminUserDto> {
    // Implementation will use admin-specific query
    throw new Error('Not implemented');
  }

  @Put(':id/role')
  @ApiOperation({ summary: 'Update user role' })
  @ApiResponse({ status: 200, type: AdminUserDto })
  async updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserRoleDto,
  ): Promise<AdminUserDto> {
    // Implementation will use admin-specific command
    throw new Error('Not implemented');
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update user status (ban/unban)' })
  @ApiResponse({ status: 200, type: AdminUserDto })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserStatusDto,
  ): Promise<AdminUserDto> {
    // Implementation will use admin-specific command
    throw new Error('Not implemented');
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user permanently' })
  @ApiResponse({ status: 204 })
  async deleteUser(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    // Implementation will use admin-specific command
    throw new Error('Not implemented');
  }
}
