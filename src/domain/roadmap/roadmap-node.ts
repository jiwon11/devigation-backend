import { Entity } from '@domain/shared/base-entity';
import { NodeId } from './node-id';
import { RoadmapId } from './roadmap-id';
import { PostId } from '@domain/post/post-id';
import { Position } from './position';
import { NodeStyle } from './node-style';
import { NodeType, NodeStatus } from './roadmap.enum';

interface RoadmapNodeProps {
  roadmapId: RoadmapId;
  title: string;
  description: string | null;
  type: NodeType;
  status: NodeStatus;
  position: Position;
  style: NodeStyle;
  linkedPostId: PostId | null;
  resourceUrl: string | null;
  order: number;
}

export class RoadmapNode extends Entity<RoadmapNodeProps, NodeId> {
  private constructor(id: NodeId, props: RoadmapNodeProps, createdAt?: Date) {
    super(id, props, createdAt);
  }

  get roadmapId(): RoadmapId {
    return this.props.roadmapId;
  }

  get title(): string {
    return this.props.title;
  }

  get description(): string | null {
    return this.props.description;
  }

  get type(): NodeType {
    return this.props.type;
  }

  get status(): NodeStatus {
    return this.props.status;
  }

  get position(): Position {
    return this.props.position;
  }

  get style(): NodeStyle {
    return this.props.style;
  }

  get linkedPostId(): PostId | null {
    return this.props.linkedPostId;
  }

  get resourceUrl(): string | null {
    return this.props.resourceUrl;
  }

  get order(): number {
    return this.props.order;
  }

  static create(params: {
    id?: NodeId;
    roadmapId: RoadmapId;
    title: string;
    description?: string;
    type?: NodeType;
    position?: Position;
    style?: NodeStyle;
    resourceUrl?: string;
    order?: number;
  }): RoadmapNode {
    const id = params.id ?? NodeId.generate();
    return new RoadmapNode(id, {
      roadmapId: params.roadmapId,
      title: params.title,
      description: params.description ?? null,
      type: params.type ?? NodeType.TOPIC,
      status: NodeStatus.NOT_STARTED,
      position: params.position ?? Position.origin(),
      style: params.style ?? NodeStyle.default(),
      linkedPostId: null,
      resourceUrl: params.resourceUrl ?? null,
      order: params.order ?? 0,
    });
  }

  static reconstitute(
    id: NodeId,
    props: RoadmapNodeProps,
    createdAt: Date,
  ): RoadmapNode {
    return new RoadmapNode(id, props, createdAt);
  }

  updateTitle(title: string): void {
    this.props.title = title;
    this.markUpdated();
  }

  updateDescription(description: string | null): void {
    this.props.description = description;
    this.markUpdated();
  }

  updatePosition(position: Position): void {
    this.props.position = position;
    this.markUpdated();
  }

  updateStyle(style: NodeStyle): void {
    this.props.style = style;
    this.markUpdated();
  }

  linkPost(postId: PostId): void {
    this.props.linkedPostId = postId;
    this.markUpdated();
  }

  unlinkPost(): void {
    this.props.linkedPostId = null;
    this.markUpdated();
  }

  updateStatus(status: NodeStatus): void {
    this.props.status = status;
    this.markUpdated();
  }

  markAsCompleted(): void {
    this.props.status = NodeStatus.COMPLETED;
    this.markUpdated();
  }

  markAsInProgress(): void {
    this.props.status = NodeStatus.IN_PROGRESS;
    this.markUpdated();
  }
}