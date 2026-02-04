import { Module } from '@nestjs/common';
import { AddCommentUseCase } from './command/add-comment.usecase';
import { DeleteCommentUseCase } from './command/delete-comment.usecase';
import { GetCommentsUseCase } from './query/get-comments.usecase';

@Module({
  providers: [AddCommentUseCase, DeleteCommentUseCase, GetCommentsUseCase],
  exports: [AddCommentUseCase, DeleteCommentUseCase, GetCommentsUseCase],
})
export class CommentModule {}