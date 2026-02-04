import { Option } from '@common/types/option.type';
import { RoadmapEdge } from '@domain/roadmap/roadmap-edge';
import { EdgeId } from '@domain/roadmap/edge-id';
import { RoadmapId } from '@domain/roadmap/roadmap-id';

export const EDGE_REPOSITORY = Symbol('EDGE_REPOSITORY');

export interface EdgeRepositoryPort {
  save(edge: RoadmapEdge): Promise<RoadmapEdge>;
  saveMany(edges: RoadmapEdge[]): Promise<RoadmapEdge[]>;
  findById(id: EdgeId): Promise<Option<RoadmapEdge>>;
  findByRoadmapId(roadmapId: RoadmapId): Promise<RoadmapEdge[]>;
  delete(id: EdgeId): Promise<void>;
  deleteByRoadmapId(roadmapId: RoadmapId): Promise<void>;
}