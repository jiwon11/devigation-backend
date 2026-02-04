import { Module } from '@nestjs/common';
import { CreatePostUseCase } from './command/create-post.usecase';
import { UpdatePostUseCase } from './command/update-post.usecase';
import { PublishPostUseCase } from './command/publish-post.usecase';
import { GetPostUseCase } from './query/get-post.usecase';
import { ListPostsUseCase } from './query/list-posts.usecase';
import { PostService } from './service/post.service';

@Module({
  providers: [
    CreatePostUseCase,
    UpdatePostUseCase,
    PublishPostUseCase,
    GetPostUseCase,
    ListPostsUseCase,
    PostService,
  ],
  exports: [
    CreatePostUseCase,
    UpdatePostUseCase,
    PublishPostUseCase,
    GetPostUseCase,
    ListPostsUseCase,
    PostService,
  ],
})
export class PostModule {}