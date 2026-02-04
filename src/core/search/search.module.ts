import { Module } from '@nestjs/common';
import { SearchRoadmapsUseCase } from './query/search-roadmaps.usecase';
import { SearchPostsUseCase } from './query/search-posts.usecase';
import { SearchUsersUseCase } from './query/search-users.usecase';

@Module({
  providers: [SearchRoadmapsUseCase, SearchPostsUseCase, SearchUsersUseCase],
  exports: [SearchRoadmapsUseCase, SearchPostsUseCase, SearchUsersUseCase],
})
export class SearchModule {}