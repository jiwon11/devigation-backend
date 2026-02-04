import { Option } from '@common/types/option.type';
import { Paginated, PaginationParams } from '@common/types/pagination.type';
import { Roadmap } from '@domain/roadmap/roadmap';
import { RoadmapId } from '@domain/roadmap/roadmap-id';
import { UserId } from '@domain/user/user-id';
import { RoadmapCategory } from '@domain/roadmap/roadmap.enum';

export const ROADMAP_REPOSITORY = Symbol('ROADMAP_REPOSITORY');

export interface RoadmapFilter {
  category?: RoadmapCategory;
  authorId?: UserId;
  isPublic?: boolean;
  tags?: string[];
  search?: string;
}

export interface RoadmapRepositoryPort {
  save(roadmap: Roadmap): Promise<Roadmap>;
  findById(id: RoadmapId): Promise<Option<Roadmap>>;
  findBySlug(slug: string): Promise<Option<Roadmap>>;
  findAll(params: PaginationParams, filter?: RoadmapFilter): Promise<Paginated<Roadmap>>;
  findByAuthor(authorId: UserId, params: PaginationParams): Promise<Paginated<Roadmap>>;
  findForkedFrom(roadmapId: RoadmapId, params: PaginationParams): Promise<Paginated<Roadmap>>;
  delete(id: RoadmapId): Promise<void>;
  incrementViewCount(id: RoadmapId): Promise<void>;
}