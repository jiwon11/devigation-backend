import { Entity } from '@domain/shared/base-entity';
import { Identifier } from '@domain/shared/identifier';
import { UserId } from '@domain/user/user-id';
import { TargetType } from './target-type';
import { v4 as uuidv4 } from 'uuid';

export class BookmarkId extends Identifier {
  private constructor(value: string) {
    super({ value });
  }

  static create(value: string): BookmarkId {
    return new BookmarkId(value);
  }

  static generate(): BookmarkId {
    return new BookmarkId(uuidv4());
  }

  protected validate(): void {
    if (this.props.value.trim().length === 0) {
      throw new Error('BookmarkId cannot be empty');
    }
  }
}

export class BookmarkFolderId extends Identifier {
  private constructor(value: string) {
    super({ value });
  }

  static create(value: string): BookmarkFolderId {
    return new BookmarkFolderId(value);
  }

  static generate(): BookmarkFolderId {
    return new BookmarkFolderId(uuidv4());
  }

  protected validate(): void {
    if (this.props.value.trim().length === 0) {
      throw new Error('BookmarkFolderId cannot be empty');
    }
  }
}

interface BookmarkProps {
  userId: UserId;
  targetType: TargetType;
  targetId: string;
  folderId: BookmarkFolderId | null;
  note: string | null;
}

export class Bookmark extends Entity<BookmarkProps, BookmarkId> {
  private constructor(id: BookmarkId, props: BookmarkProps, createdAt?: Date) {
    super(id, props, createdAt);
  }

  get userId(): UserId {
    return this.props.userId;
  }

  get targetType(): TargetType {
    return this.props.targetType;
  }

  get targetId(): string {
    return this.props.targetId;
  }

  get folderId(): BookmarkFolderId | null {
    return this.props.folderId;
  }

  get note(): string | null {
    return this.props.note;
  }

  static create(params: {
    userId: UserId;
    targetType: TargetType;
    targetId: string;
    folderId?: BookmarkFolderId;
    note?: string;
  }): Bookmark {
    return new Bookmark(BookmarkId.generate(), {
      userId: params.userId,
      targetType: params.targetType,
      targetId: params.targetId,
      folderId: params.folderId ?? null,
      note: params.note ?? null,
    });
  }

  static reconstitute(
    id: BookmarkId,
    props: BookmarkProps,
    createdAt: Date,
  ): Bookmark {
    return new Bookmark(id, props, createdAt);
  }

  moveToFolder(folderId: BookmarkFolderId | null): void {
    this.props.folderId = folderId;
    this.markUpdated();
  }

  updateNote(note: string | null): void {
    this.props.note = note;
    this.markUpdated();
  }
}