import { Entity } from '@domain/shared/base-entity';
import { CommentId } from './comment-id';
import { PostId } from '@domain/post/post-id';
import { UserId } from '@domain/user/user-id';

interface CommentProps {
  postId: PostId;
  authorId: UserId;
  content: string;
  parentId: CommentId | null;
  depth: number;
  likeCount: number;
  replyCount: number;
  isDeleted: boolean;
}

export class Comment extends Entity<CommentProps, CommentId> {
  private static readonly MAX_DEPTH = 3;
  private static readonly MAX_CONTENT_LENGTH = 1000;

  private constructor(id: CommentId, props: CommentProps, createdAt?: Date) {
    super(id, props, createdAt);
  }

  // Getters
  get postId(): PostId {
    return this.props.postId;
  }

  get authorId(): UserId {
    return this.props.authorId;
  }

  get content(): string {
    return this.props.content;
  }

  get parentId(): CommentId | null {
    return this.props.parentId;
  }

  get depth(): number {
    return this.props.depth;
  }

  get likeCount(): number {
    return this.props.likeCount;
  }

  get replyCount(): number {
    return this.props.replyCount;
  }

  get isDeleted(): boolean {
    return this.props.isDeleted;
  }

  // Factory methods
  static create(params: {
    id?: CommentId;
    postId: PostId;
    authorId: UserId;
    content: string;
    parentId?: CommentId;
    parentDepth?: number;
  }): Comment {
    const id = params.id ?? CommentId.generate();
    const depth = params.parentId !== undefined ? (params.parentDepth ?? 0) + 1 : 0;

    if (depth > Comment.MAX_DEPTH) {
      throw new Error(`Maximum reply depth of ${Comment.MAX_DEPTH} exceeded`);
    }

    if (params.content.length > Comment.MAX_CONTENT_LENGTH) {
      throw new Error(`Content must not exceed ${Comment.MAX_CONTENT_LENGTH} characters`);
    }

    return new Comment(id, {
      postId: params.postId,
      authorId: params.authorId,
      content: params.content,
      parentId: params.parentId ?? null,
      depth,
      likeCount: 0,
      replyCount: 0,
      isDeleted: false,
    });
  }

  static reconstitute(
    id: CommentId,
    props: CommentProps,
    createdAt: Date,
  ): Comment {
    return new Comment(id, props, createdAt);
  }

  // Domain methods
  updateContent(content: string): void {
    if (content.length > Comment.MAX_CONTENT_LENGTH) {
      throw new Error(`Content must not exceed ${Comment.MAX_CONTENT_LENGTH} characters`);
    }
    this.props.content = content;
    this.markUpdated();
  }

  softDelete(): void {
    this.props.isDeleted = true;
    this.props.content = '삭제된 댓글입니다.';
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

  incrementReplyCount(): void {
    this.props.replyCount += 1;
  }

  decrementReplyCount(): void {
    if (this.props.replyCount > 0) {
      this.props.replyCount -= 1;
    }
  }

  isReply(): boolean {
    return this.props.parentId !== null;
  }

  isOwnedBy(userId: UserId): boolean {
    return this.props.authorId.equals(userId);
  }

  canReply(): boolean {
    return this.props.depth < Comment.MAX_DEPTH && !this.props.isDeleted;
  }
}