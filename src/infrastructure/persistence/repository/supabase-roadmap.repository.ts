import { Injectable } from '@nestjs/common';
import { Option } from '@common/types/option.type';
import { Paginated, Pagination, PaginationParams } from '@common/types/pagination.type';
import { Roadmap } from '@domain/roadmap/roadmap';
import { RoadmapId } from '@domain/roadmap/roadmap-id';
import { UserId } from '@domain/user/user-id';
import { RoadmapRepositoryPort, RoadmapFilter } from '@core/roadmap/port/out/roadmap-repository.port';
import { SupabaseService } from '@infrastructure/supabase/supabase.service';

@Injectable()
export class SupabaseRoadmapRepository implements RoadmapRepositoryPort {
  constructor(private readonly supabase: SupabaseService) {}

  async save(roadmap: Roadmap): Promise<Roadmap> {
    // Implementation
    return roadmap;
  }

  async findById(id: RoadmapId): Promise<Option<Roadmap>> {
    // Implementation
    return Option.none();
  }

  async findBySlug(slug: string): Promise<Option<Roadmap>> {
    return Option.none();
  }

  async findAll(params: PaginationParams, filter?: RoadmapFilter): Promise<Paginated<Roadmap>> {
    return Pagination.create([], params, 0);
  }

  async findByAuthor(authorId: UserId, params: PaginationParams): Promise<Paginated<Roadmap>> {
    return Pagination.create([], params, 0);
  }

  async findForkedFrom(roadmapId: RoadmapId, params: PaginationParams): Promise<Paginated<Roadmap>> {
    return Pagination.create([], params, 0);
  }

  async delete(id: RoadmapId): Promise<void> {
    // Implementation
  }

  async incrementViewCount(id: RoadmapId): Promise<void> {
    await this.supabase
      .getAdminClient()
      .rpc('increment_roadmap_view_count', { roadmap_id: id.value });
  }
}