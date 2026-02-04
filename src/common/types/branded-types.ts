/**
 * Branded Types - 타입 안전한 ID를 위한 패턴
 * 컴파일 타임에 서로 다른 ID 타입을 구분
 */

declare const brand: unique symbol;

export type Brand<T, B> = T & { readonly [brand]: B };

// ID 타입 정의
export type UserId = Brand<string, 'UserId'>;
export type RoadmapId = Brand<string, 'RoadmapId'>;
export type NodeId = Brand<string, 'NodeId'>;
export type EdgeId = Brand<string, 'EdgeId'>;
export type PostId = Brand<string, 'PostId'>;
export type CommentId = Brand<string, 'CommentId'>;
export type TagId = Brand<string, 'TagId'>;
export type LikeId = Brand<string, 'LikeId'>;
export type BookmarkId = Brand<string, 'BookmarkId'>;
export type BookmarkFolderId = Brand<string, 'BookmarkFolderId'>;
export type NotificationId = Brand<string, 'NotificationId'>;
export type FollowId = Brand<string, 'FollowId'>;

// ID 생성 함수
export const UserId = {
  create: (id: string): UserId => id as UserId,
  generate: (): UserId => crypto.randomUUID() as UserId,
};

export const RoadmapId = {
  create: (id: string): RoadmapId => id as RoadmapId,
  generate: (): RoadmapId => crypto.randomUUID() as RoadmapId,
};

export const NodeId = {
  create: (id: string): NodeId => id as NodeId,
  generate: (): NodeId => crypto.randomUUID() as NodeId,
};

export const EdgeId = {
  create: (id: string): EdgeId => id as EdgeId,
  generate: (): EdgeId => crypto.randomUUID() as EdgeId,
};

export const PostId = {
  create: (id: string): PostId => id as PostId,
  generate: (): PostId => crypto.randomUUID() as PostId,
};

export const CommentId = {
  create: (id: string): CommentId => id as CommentId,
  generate: (): CommentId => crypto.randomUUID() as CommentId,
};

export const TagId = {
  create: (id: string): TagId => id as TagId,
  generate: (): TagId => crypto.randomUUID() as TagId,
};

export const LikeId = {
  create: (id: string): LikeId => id as LikeId,
  generate: (): LikeId => crypto.randomUUID() as LikeId,
};

export const BookmarkId = {
  create: (id: string): BookmarkId => id as BookmarkId,
  generate: (): BookmarkId => crypto.randomUUID() as BookmarkId,
};

export const BookmarkFolderId = {
  create: (id: string): BookmarkFolderId => id as BookmarkFolderId,
  generate: (): BookmarkFolderId => crypto.randomUUID() as BookmarkFolderId,
};

export const NotificationId = {
  create: (id: string): NotificationId => id as NotificationId,
  generate: (): NotificationId => crypto.randomUUID() as NotificationId,
};

export const FollowId = {
  create: (id: string): FollowId => id as FollowId,
  generate: (): FollowId => crypto.randomUUID() as FollowId,
};