import { Option } from '@common/types/option.type';
import { RoadmapNode } from '@domain/roadmap/roadmap-node';
import { NodeId } from '@domain/roadmap/node-id';
import { RoadmapId } from '@domain/roadmap/roadmap-id';

export const NODE_REPOSITORY = Symbol('NODE_REPOSITORY');

export interface NodeRepositoryPort {
  save(node: RoadmapNode): Promise<RoadmapNode>;
  saveMany(nodes: RoadmapNode[]): Promise<RoadmapNode[]>;
  findById(id: NodeId): Promise<Option<RoadmapNode>>;
  findByRoadmapId(roadmapId: RoadmapId): Promise<RoadmapNode[]>;
  delete(id: NodeId): Promise<void>;
  deleteByRoadmapId(roadmapId: RoadmapId): Promise<void>;
}