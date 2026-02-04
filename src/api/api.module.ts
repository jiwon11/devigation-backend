import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { UserController } from './user/user.controller';
import { RoadmapController } from './roadmap/roadmap.controller';
import { PostController } from './post/post.controller';
import { CommentController } from './comment/comment.controller';
import { InteractionController } from './interaction/interaction.controller';
import { SearchController } from './search/search.controller';
import { CoreModule } from '@core/core.module';

@Module({
  imports: [CoreModule],
  controllers: [
    AuthController,
    UserController,
    RoadmapController,
    PostController,
    CommentController,
    InteractionController,
    SearchController,
  ],
})
export class ApiModule {}
