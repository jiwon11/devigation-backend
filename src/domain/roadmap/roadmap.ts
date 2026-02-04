import { AggregateRoot } from '@domain/shared/aggregate-root';
import { RoadmapId } from './roadmap-id';
import { UserId } from '@domain/user/user-id';
import { RoadmapNode } from './roadmap-node';
import { RoadmapEdge } from './roadmap-edge';
import { Visibility, VisibilityType } from './visibility';
import { RoadmapCategory } from './roadmap.enum';
import { MaxNodesExceededException } from './roadmap.exception';

interface RoadmapProps {
  title: string;
  description: string | null;
  category: RoadmapCategory;
  visibility: Visibility;
  authorId: UserId;
  thumbnailUrl: string | null;
  tags: string[];
  forkedFromId: RoadmapId | null;
  starCount: number;
  forkCount: number;
  viewCount: number;
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
}

export class Roadmap extends AggregateRoot<RoadmapProps, RoadmapId> {
  private static readonly MAX_NODES = 100;

  private constructor(id: RoadmapId, props: RoadmapProps, createdAt?: Date) {
    super(id, props, createdAt);
  }

  // Getters
  get title(): string {
    return this.props.title;
  }

  get description(): string | null {
    return this.props.description;
  }

  get category(): RoadmapCategory {
    return this.props.category;
  }

  get visibility(): Visibility {
    return this.props.visibility;
  }

  get authorId(): UserId {
    return this.props.authorId;
  }

  get thumbnailUrl(): string | null {
    return this.props.thumbnailUrl;
  }

  get tags(): readonly string[] {
    return Object.freeze([...this.props.tags]);
  }

  get forkedFromId(): RoadmapId | null {
    return this.props.forkedFromId;
  }

  get starCount(): number {
    return this.props.starCount;
  }

  get forkCount(): number {
    return this.props.forkCount;
  }

  get viewCount(): number {
    return this.props.viewCount;
  }

  get nodes(): readonly RoadmapNode[] {
    return Object.freeze([...this.props.nodes]);
  }

  get edges(): readonly RoadmapEdge[] {
    return Object.freeze([...this.props.edges]);
  }

  // Factory methods
  static create(params: {
    id?: RoadmapId;
    title: string;
    description?: string;
    category: RoadmapCategory;
    visibility?: VisibilityType;
    authorId: UserId;
    thumbnailUrl?: string;
    tags?: string[];
  }): Roadmap {
    const id = params.id ?? RoadmapId.generate();
    return new Roadmap(id, {
      title: params.title,
      description: params.description ?? null,
      category: params.category,
      visibility: params.visibility !== undefined
        ? Visibility.create(params.visibility)
        : Visibility.public(),
      authorId: params.authorId,
      thumbnailUrl: params.thumbnailUrl ?? null,
      tags: params.tags ?? [],
      forkedFromId: null,
      starCount: 0,
      forkCount: 0,
      viewCount: 0,
      nodes: [],
      edges: [],
    });
  }

  static reconstitute(
    id: RoadmapId,
    props: RoadmapProps,
    createdAt: Date,
  ): Roadmap {
    return new Roadmap(id, props, createdAt);
  }

  // Fork method
  fork(newAuthorId: UserId): Roadmap {
    const forkedId = RoadmapId.generate();
    const forkedRoadmap = new Roadmap(forkedId, {
      title: `${this.props.title} (Fork)`,
      description: this.props.description,
      category: this.props.category,
      visibility: Visibility.private(),
      authorId: newAuthorId,
      thumbnailUrl: this.props.thumbnailUrl,
      tags: [...this.props.tags],
      forkedFromId: this.id,
      starCount: 0,
      forkCount: 0,
      viewCount: 0,
      nodes: [],
      edges: [],
    });

    // Fork nodes with new IDs
    const nodeIdMap = new Map<string, RoadmapNode>();
    for (const node of this.props.nodes) {
      const forkedNode = RoadmapNode.create({
        roadmapId: forkedId,
        title: node.title,
        description: node.description ?? undefined,
        type: node.type,
        position: node.position,
        style: node.style,
        resourceUrl: node.resourceUrl ?? undefined,
        order: node.order,
      });
      nodeIdMap.set(node.id.value, forkedNode);
      forkedRoadmap.props.nodes.push(forkedNode);
    }

    // Fork edges with mapped node IDs
    for (const edge of this.props.edges) {
      const sourceNode = nodeIdMap.get(edge.sourceNodeId.value);
      const targetNode = nodeIdMap.get(edge.targetNodeId.value);
      if (sourceNode !== undefined && targetNode !== undefined) {
        const forkedEdge = RoadmapEdge.create({
          roadmapId: forkedId,
          sourceNodeId: sourceNode.id,
          targetNodeId: targetNode.id,
          type: edge.type,
          label: edge.label ?? undefined,
        });
        forkedRoadmap.props.edges.push(forkedEdge);
      }
    }

    this.props.forkCount += 1;
    return forkedRoadmap;
  }

  // Domain methods
  updateTitle(title: string): void {
    this.props.title = title;
    this.markUpdated();
  }

  updateDescription(description: string | null): void {
    this.props.description = description;
    this.markUpdated();
  }

  updateCategory(category: RoadmapCategory): void {
    this.props.category = category;
    this.markUpdated();
  }

  updateVisibility(visibility: VisibilityType): void {
    this.props.visibility = Visibility.create(visibility);
    this.markUpdated();
  }

  updateThumbnail(thumbnailUrl: string | null): void {
    this.props.thumbnailUrl = thumbnailUrl;
    this.markUpdated();
  }

  updateTags(tags: string[]): void {
    this.props.tags = [...tags];
    this.markUpdated();
  }

  addNode(node: RoadmapNode): void {
    if (this.props.nodes.length >= Roadmap.MAX_NODES) {
      throw new MaxNodesExceededException(Roadmap.MAX_NODES);
    }
    this.props.nodes.push(node);
    this.markUpdated();
  }

  removeNode(nodeId: string): void {
    const index = this.props.nodes.findIndex((n) => n.id.value === nodeId);
    if (index !== -1) {
      this.props.nodes.splice(index, 1);
      // Remove related edges
      this.props.edges = this.props.edges.filter(
        (e) => e.sourceNodeId.value !== nodeId && e.targetNodeId.value !== nodeId,
      );
      this.markUpdated();
    }
  }

  addEdge(edge: RoadmapEdge): void {
    this.props.edges.push(edge);
    this.markUpdated();
  }

  removeEdge(edgeId: string): void {
    const index = this.props.edges.findIndex((e) => e.id.value === edgeId);
    if (index !== -1) {
      this.props.edges.splice(index, 1);
      this.markUpdated();
    }
  }

  incrementStarCount(): void {
    this.props.starCount += 1;
  }

  decrementStarCount(): void {
    if (this.props.starCount > 0) {
      this.props.starCount -= 1;
    }
  }

  incrementViewCount(): void {
    this.props.viewCount += 1;
  }

  isPublic(): boolean {
    return this.props.visibility.isPublic();
  }

  isOwnedBy(userId: UserId): boolean {
    return this.props.authorId.equals(userId);
  }

  isForked(): boolean {
    return this.props.forkedFromId !== null;
  }
}