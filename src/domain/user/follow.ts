import { Entity } from '@domain/shared/base-entity';
import { Identifier } from '@domain/shared/identifier';
import { UserId } from './user-id';
import { v4 as uuidv4 } from 'uuid';

export class FollowId extends Identifier {
  private constructor(value: string) {
    super({ value });
  }

  static create(value: string): FollowId {
    return new FollowId(value);
  }

  static generate(): FollowId {
    return new FollowId(uuidv4());
  }

  protected validate(): void {
    if (this.props.value.trim().length === 0) {
      throw new Error('FollowId cannot be empty');
    }
  }
}

interface FollowProps {
  followerId: UserId;
  followingId: UserId;
}

export class Follow extends Entity<FollowProps, FollowId> {
  private constructor(id: FollowId, props: FollowProps, createdAt?: Date) {
    super(id, props, createdAt);
  }

  get followerId(): UserId {
    return this.props.followerId;
  }

  get followingId(): UserId {
    return this.props.followingId;
  }

  static create(followerId: UserId, followingId: UserId): Follow {
    if (followerId.equals(followingId)) {
      throw new Error('Cannot follow yourself');
    }
    return new Follow(FollowId.generate(), {
      followerId,
      followingId,
    });
  }

  static reconstitute(
    id: FollowId,
    props: FollowProps,
    createdAt: Date,
  ): Follow {
    return new Follow(id, props, createdAt);
  }
}