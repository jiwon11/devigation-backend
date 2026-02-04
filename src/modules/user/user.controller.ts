import { Controller, Get, Patch, Delete, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 정보 조회' })
  async getMe(@CurrentUser() user: CurrentUserPayload) {
    return this.userService.findById(user.id);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 정보 수정' })
  async updateMe(
    @CurrentUser() user: CurrentUserPayload,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(user.id, updateUserDto);
  }

  @Get(':username')
  @ApiOperation({ summary: '사용자 프로필 조회' })
  async getProfile(@Param('username') username: string) {
    return this.userService.findByUsername(username);
  }

  @Post(':id/follow')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '팔로우' })
  async follow(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') followingId: string,
  ) {
    return this.userService.follow(user.id, followingId);
  }

  @Delete(':id/follow')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '언팔로우' })
  async unfollow(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') followingId: string,
  ) {
    return this.userService.unfollow(user.id, followingId);
  }
}
