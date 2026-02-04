import { Entity } from '@domain/shared/base-entity';
import { Identifier } from '@domain/shared/identifier';
import { UserId } from '@domain/user/user-id';
import { TargetType } from './target-type';
import { v4 as uuidv4 } from 'uuid';

export class LikeId extends Identifier {
  private constructor(value: string) {
    super({ value });
  }

  static create(value: string): LikeId {
    return new LikeId(value);
  }

  static generate(): LikeId {
    return new LikeId(uuidv4());
  }

  protected validate(): void {
    if (this.props.value.trim().length === 0) {
      throw new Error('LikeId cannot be empty');
    }
  }
}

interface LikeProps {
  userId: UserId;
  targetType: TargetType;
  targetId: string;
}

export class Like extends Entity<LikeProps, LikeId> {
  private constructor(id: LikeId, props: LikeProps, createdAt?: Date) {
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

  static create(params: {
    userId: UserId;
    targetType: TargetType;
    targetId: string;
  }): Like {
    return new Like(LikeId.generate(), {
      userId: params.userId,
      targetType: params.targetType,
      targetId: params.targetId,
    });
  }

  static reconstitute(
    id: LikeId,
    props: LikeProps,
    createdAt: Date,
  ): Like {
    return new Like(id, props, createdAt);
  }
}