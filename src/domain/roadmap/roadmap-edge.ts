import { Entity } from '@domain/shared/base-entity';
import { EdgeId } from './edge-id';
import { RoadmapId } from './roadmap-id';
import { NodeId } from './node-id';
import { EdgeType } from './roadmap.enum';

interface RoadmapEdgeProps {
  roadmapId: RoadmapId;
  sourceNodeId: NodeId;
  targetNodeId: NodeId;
  type: EdgeType;
  label: string | null;
}

export class RoadmapEdge extends Entity<RoadmapEdgeProps, EdgeId> {
  private constructor(id: EdgeId, props: RoadmapEdgeProps, createdAt?: Date) {
    super(id, props, createdAt);
  }

  get roadmapId(): RoadmapId {
    return this.props.roadmapId;
  }

  get sourceNodeId(): NodeId {
    return this.props.sourceNodeId;
  }

  get targetNodeId(): NodeId {
    return this.props.targetNodeId;
  }

  get type(): EdgeType {
    return this.props.type;
  }

  get label(): string | null {
    return this.props.label;
  }

  static create(params: {
    id?: EdgeId;
    roadmapId: RoadmapId;
    sourceNodeId: NodeId;
    targetNodeId: NodeId;
    type?: EdgeType;
    label?: string;
  }): RoadmapEdge {
    if (params.sourceNodeId.equals(params.targetNodeId)) {
      throw new Error('Source and target nodes cannot be the same');
    }

    const id = params.id ?? EdgeId.generate();
    return new RoadmapEdge(id, {
      roadmapId: params.roadmapId,
      sourceNodeId: params.sourceNodeId,
      targetNodeId: params.targetNodeId,
      type: params.type ?? EdgeType.DEFAULT,
      label: params.label ?? null,
    });
  }

  static reconstitute(
    id: EdgeId,
    props: RoadmapEdgeProps,
    createdAt: Date,
  ): RoadmapEdge {
    return new RoadmapEdge(id, props, createdAt);
  }

  updateType(type: EdgeType): void {
    this.props.type = type;
    this.markUpdated();
  }

  updateLabel(label: string | null): void {
    this.props.label = label;
    this.markUpdated();
  }
}