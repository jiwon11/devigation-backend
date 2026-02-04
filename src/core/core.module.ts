import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RoadmapModule } from './roadmap/roadmap.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { InteractionModule } from './interaction/interaction.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    RoadmapModule,
    PostModule,
    CommentModule,
    InteractionModule,
    SearchModule,
  ],
  exports: [
    UserModule,
    AuthModule,
    RoadmapModule,
    PostModule,
    CommentModule,
    InteractionModule,
    SearchModule,
  ],
})
export class CoreModule {}