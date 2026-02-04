import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '댓글 작성' })
  create(@CurrentUser() user: CurrentUserPayload, @Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(user.id, createCommentDto);
  }

  @Get('post/:postId')
  @Public()
  @ApiOperation({ summary: '게시글 댓글 목록 조회' })
  findByPostId(@Param('postId') postId: string) {
    return this.commentService.findByPostId(postId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '댓글 수정' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserPayload,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.update(id, user.id, updateCommentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '댓글 삭제' })
  remove(@Param('id') id: string, @CurrentUser() user: CurrentUserPayload) {
    return this.commentService.remove(id, user.id);
  }
}
