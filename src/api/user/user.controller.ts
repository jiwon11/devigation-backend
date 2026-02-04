import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UpdateProfileCommand } from '@core/user/commands/update-profile.command';
import { FollowUserCommand } from '@core/user/commands/follow-user.command';
import { UnfollowUserCommand } from '@core/user/commands/unfollow-user.command';
import { GetUserQuery } from '@core/user/queries/get-user.query';
import { GetFollowersQuery } from '@core/user/queries/get-followers.query';
import { GetFollowingQuery } from '@core/user/queries/get-following.query';
import { JwtAuthGuard } from '@infrastructure/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { Public } from '@common/decorators/public.decorator';
import {
  UserProfileDto,
  UserSummaryDto,
  UpdateProfileDto,
} from './dto';
import { PaginationDto, PaginatedResponseDto } from '@common/types/pagination.type';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, type: UserProfileDto })
  async getUser(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') currentUserId?: string,
  ): Promise<UserProfileDto> {
    const query = new GetUserQuery(id, currentUserId);
    const result = await this.queryBus.execute(query);

    if (result.isNone()) {
      throw new Error('User not found');
    }

    return result.unwrap();
  }

  @Public()
  @Get('username/:username')
  @ApiOperation({ summary: 'Get user by username' })
  @ApiResponse({ status: 200, type: UserProfileDto })
  async getUserByUsername(
    @Param('username') username: string,
    @CurrentUser('id') currentUserId?: string,
  ): Promise<UserProfileDto> {
    const query = new GetUserQuery(undefined, currentUserId, username);
    const result = await this.queryBus.execute(query);

    if (result.isNone()) {
      throw new Error('User not found');
    }

    return result.unwrap();
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, type: UserProfileDto })
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateProfileDto,
  ): Promise<UserProfileDto> {
    const command = new UpdateProfileCommand(userId, dto);
    const result = await this.commandBus.execute(command);

    if (result.isFailure()) {
      throw result.getError();
    }

    return result.getValue();
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/follow')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Follow a user' })
  @ApiResponse({ status: 200 })
  async followUser(
    @Param('id', ParseUUIDPipe) targetUserId: string,
    @CurrentUser('id') userId: string,
  ): Promise<void> {
    const command = new FollowUserCommand(userId, targetUserId);
    const result = await this.commandBus.execute(command);

    if (result.isFailure()) {
      throw result.getError();
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/follow')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unfollow a user' })
  @ApiResponse({ status: 200 })
  async unfollowUser(
    @Param('id', ParseUUIDPipe) targetUserId: string,
    @CurrentUser('id') userId: string,
  ): Promise<void> {
    const command = new UnfollowUserCommand(userId, targetUserId);
    const result = await this.commandBus.execute(command);

    if (result.isFailure()) {
      throw result.getError();
    }
  }

  @Public()
  @Get(':id/followers')
  @ApiOperation({ summary: 'Get user followers' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, type: PaginatedResponseDto })
  async getFollowers(
    @Param('id', ParseUUIDPipe) userId: string,
    @Query() pagination: PaginationDto,
  ): Promise<PaginatedResponseDto<UserSummaryDto>> {
    const query = new GetFollowersQuery(userId, pagination);
    return this.queryBus.execute(query);
  }

  @Public()
  @Get(':id/following')
  @ApiOperation({ summary: 'Get users that this user follows' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, type: PaginatedResponseDto })
  async getFollowing(
    @Param('id', ParseUUIDPipe) userId: string,
    @Query() pagination: PaginationDto,
  ): Promise<PaginatedResponseDto<UserSummaryDto>> {
    const query = new GetFollowingQuery(userId, pagination);
    return this.queryBus.execute(query);
  }
}
