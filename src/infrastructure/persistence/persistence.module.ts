import { Module } from '@nestjs/common';
import { SupabaseUserRepository } from './repository/supabase-user.repository';
import { SupabaseFollowRepository } from './repository/supabase-follow.repository';
import { SupabaseRoadmapRepository } from './repository/supabase-roadmap.repository';
import { SupabasePostRepository } from './repository/supabase-post.repository';
import { SupabaseCommentRepository } from './repository/supabase-comment.repository';
import { SupabaseLikeRepository } from './repository/supabase-like.repository';
import { SupabaseBookmarkRepository } from './repository/supabase-bookmark.repository';
import { SupabaseNotificationRepository } from './repository/supabase-notification.repository';
import { USER_REPOSITORY } from '@core/user/port/out/user-repository.port';
import { FOLLOW_REPOSITORY } from '@core/user/port/out/follow-repository.port';
import { ROADMAP_REPOSITORY } from '@core/roadmap/port/out/roadmap-repository.port';
import { POST_REPOSITORY } from '@core/post/port/out/post-repository.port';
import { COMMENT_REPOSITORY } from '@core/comment/port/out/comment-repository.port';
import { LIKE_REPOSITORY } from '@core/interaction/port/out/like-repository.port';
import { BOOKMARK_REPOSITORY } from '@core/interaction/port/out/bookmark-repository.port';
import { NOTIFICATION_REPOSITORY } from '@core/interaction/port/out/notification-repository.port';

@Module({
  providers: [
    { provide: USER_REPOSITORY, useClass: SupabaseUserRepository },
    { provide: FOLLOW_REPOSITORY, useClass: SupabaseFollowRepository },
    { provide: ROADMAP_REPOSITORY, useClass: SupabaseRoadmapRepository },
    { provide: POST_REPOSITORY, useClass: SupabasePostRepository },
    { provide: COMMENT_REPOSITORY, useClass: SupabaseCommentRepository },
    { provide: LIKE_REPOSITORY, useClass: SupabaseLikeRepository },
    { provide: BOOKMARK_REPOSITORY, useClass: SupabaseBookmarkRepository },
    { provide: NOTIFICATION_REPOSITORY, useClass: SupabaseNotificationRepository },
  ],
  exports: [
    USER_REPOSITORY,
    FOLLOW_REPOSITORY,
    ROADMAP_REPOSITORY,
    POST_REPOSITORY,
    COMMENT_REPOSITORY,
    LIKE_REPOSITORY,
    BOOKMARK_REPOSITORY,
    NOTIFICATION_REPOSITORY,
  ],
})
export class PersistenceModule {}