import { Module } from '@nestjs/common';
import { PostgresSearchAdapter } from './postgres-search.adapter';
import { SEARCH_ENGINE } from '@core/search/port/out/search-engine.port';

@Module({
  providers: [{ provide: SEARCH_ENGINE, useClass: PostgresSearchAdapter }],
  exports: [SEARCH_ENGINE],
})
export class SearchInfraModule {}