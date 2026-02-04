import { Entity } from '@domain/shared/base-entity';
import { Identifier } from '@domain/shared/identifier';
import { v4 as uuidv4 } from 'uuid';

export class TagId extends Identifier {
  private constructor(value: string) {
    super({ value });
  }

  static create(value: string): TagId {
    return new TagId(value);
  }

  static generate(): TagId {
    return new TagId(uuidv4());
  }

  protected validate(): void {
    if (this.props.value.trim().length === 0) {
      throw new Error('TagId cannot be empty');
    }
  }
}

interface TagProps {
  name: string;
  slug: string;
  postCount: number;
}

export class Tag extends Entity<TagProps, TagId> {
  private constructor(id: TagId, props: TagProps, createdAt?: Date) {
    super(id, props, createdAt);
  }

  get name(): string {
    return this.props.name;
  }

  get slug(): string {
    return this.props.slug;
  }

  get postCount(): number {
    return this.props.postCount;
  }

  static create(name: string): Tag {
    const slug = Tag.generateSlug(name);
    return new Tag(TagId.generate(), {
      name,
      slug,
      postCount: 0,
    });
  }

  static reconstitute(id: TagId, props: TagProps, createdAt: Date): Tag {
    return new Tag(id, props, createdAt);
  }

  private static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s\uac00-\ud7a3-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  incrementPostCount(): void {
    this.props.postCount += 1;
  }

  decrementPostCount(): void {
    if (this.props.postCount > 0) {
      this.props.postCount -= 1;
    }
  }
}