import { AggregateRoot } from '@domain/shared/aggregate-root';
import { PostId } from './post-id';
import { UserId } from '@domain/user/user-id';
import { RoadmapId } from '@domain/roadmap/roadmap-id';
import { NodeId } from '@domain/roadmap/node-id';
import { PostContent } from './post-content';
import { ReadTime } from './read-time';
import { PostStatus } from './post.enum';

interface PostProps {
  title: string;
  slug: string;
  content: PostContent;
  excerpt: string | null;
  thumbnailUrl: string | null;
  authorId: UserId;
  roadmapId: RoadmapId | null;
  nodeId: NodeId | null;
  status: PostStatus;
  readTime: ReadTime;
  tags: string[];
  likeCount: number;
  commentCount: number;
  viewCount: number;
  publishedAt: Date | null;
}

export class Post extends AggregateRoot<PostProps, PostId> {
  private constructor(id: PostId, props: PostProps, createdAt?: Date) {
    super(id, props, createdAt);
  }

  // Getters
  get title(): string {
    return this.props.title;
  }

  get slug(): string {
    return this.props.slug;
  }

  get content(): PostContent {
    return this.props.content;
  }

  get excerpt(): string | null {
    return this.props.excerpt;
  }

  get thumbnailUrl(): string | null {
    return this.props.thumbnailUrl;
  }

  get authorId(): UserId {
    return this.props.authorId;
  }

  get roadmapId(): RoadmapId | null {
    return this.props.roadmapId;
  }

  get nodeId(): NodeId | null {
    return this.props.nodeId;
  }

  get status(): PostStatus {
    return this.props.status;
  }

  get readTime(): ReadTime {
    return this.props.readTime;
  }

  get tags(): readonly string[] {
    return Object.freeze([...this.props.tags]);
  }

  get likeCount(): number {
    return this.props.likeCount;
  }

  get commentCount(): number {
    return this.props.commentCount;
  }

  get viewCount(): number {
    return this.props.viewCount;
  }

  get publishedAt(): Date | null {
    return this.props.publishedAt;
  }

  // Factory method
  static create(params: {
    id?: PostId;
    title: string;
    content: string;
    authorId: UserId;
    excerpt?: string;
    thumbnailUrl?: string;
    roadmapId?: RoadmapId;
    nodeId?: NodeId;
    tags?: string[];
  }): Post {
    const id = params.id ?? PostId.generate();
    const postContent = PostContent.create(params.content);
    const slug = Post.generateSlug(params.title, id.value);

    return new Post(id, {
      title: params.title,
      slug,
      content: postContent,
      excerpt: params.excerpt ?? null,
      thumbnailUrl: params.thumbnailUrl ?? null,
      authorId: params.authorId,
      roadmapId: params.roadmapId ?? null,
      nodeId: params.nodeId ?? null,
      status: PostStatus.DRAFT,
      readTime: ReadTime.fromWordCount(postContent.wordCount),
      tags: params.tags ?? [],
      likeCount: 0,
      commentCount: 0,
      viewCount: 0,
      publishedAt: null,
    });
  }

  static reconstitute(
    id: PostId,
    props: PostProps,
    createdAt: Date,
  ): Post {
    return new Post(id, props, createdAt);
  }

  private static generateSlug(title: string, id: string): string {
    const baseSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s\uac00-\ud7a3-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return `${baseSlug}-${id.slice(0, 8)}`;
  }

  // Domain methods
  updateTitle(title: string): void {
    this.props.title = title;
    this.props.slug = Post.generateSlug(title, this.id.value);
    this.markUpdated();
  }

  updateContent(content: string): void {
    this.props.content = PostContent.create(content);
    this.props.readTime = ReadTime.fromWordCount(this.props.content.wordCount);
    this.markUpdated();
  }

  updateExcerpt(excerpt: string | null): void {
    this.props.excerpt = excerpt;
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

  linkToRoadmap(roadmapId: RoadmapId, nodeId: NodeId): void {
    this.props.roadmapId = roadmapId;
    this.props.nodeId = nodeId;
    this.markUpdated();
  }

  unlinkFromRoadmap(): void {
    this.props.roadmapId = null;
    this.props.nodeId = null;
    this.markUpdated();
  }

  publish(): void {
    if (this.props.status === PostStatus.PUBLISHED) {
      return;
    }
    this.props.status = PostStatus.PUBLISHED;
    this.props.publishedAt = new Date();
    this.markUpdated();
  }

  unpublish(): void {
    this.props.status = PostStatus.DRAFT;
    this.markUpdated();
  }

  archive(): void {
    this.props.status = PostStatus.ARCHIVED;
    this.markUpdated();
  }

  incrementLikeCount(): void {
    this.props.likeCount += 1;
  }

  decrementLikeCount(): void {
    if (this.props.likeCount > 0) {
      this.props.likeCount -= 1;
    }
  }

  incrementCommentCount(): void {
    this.props.commentCount += 1;
  }

  decrementCommentCount(): void {
    if (this.props.commentCount > 0) {
      this.props.commentCount -= 1;
    }
  }

  incrementViewCount(): void {
    this.props.viewCount += 1;
  }

  isPublished(): boolean {
    return this.props.status === PostStatus.PUBLISHED;
  }

  isDraft(): boolean {
    return this.props.status === PostStatus.DRAFT;
  }

  isOwnedBy(userId: UserId): boolean {
    return this.props.authorId.equals(userId);
  }
}