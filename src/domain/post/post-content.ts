import { ValueObject } from '@domain/shared/value-object';

interface PostContentProps {
  content: string;
  plainText: string;
  wordCount: number;
}

export class PostContent extends ValueObject<PostContentProps> {
  private static readonly MIN_LENGTH = 10;
  private static readonly MAX_LENGTH = 50000;

  private constructor(props: PostContentProps) {
    super(props);
  }

  get content(): string {
    return this.props.content;
  }

  get plainText(): string {
    return this.props.plainText;
  }

  get wordCount(): number {
    return this.props.wordCount;
  }

  static create(content: string): PostContent {
    const plainText = PostContent.stripHtml(content);
    const wordCount = PostContent.countWords(plainText);
    return new PostContent({ content, plainText, wordCount });
  }

  private static stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  private static countWords(text: string): number {
    return text.split(/\s+/).filter((word) => word.length > 0).length;
  }

  protected validate(): void {
    if (this.props.content.length < PostContent.MIN_LENGTH) {
      throw new Error(`Content must be at least ${PostContent.MIN_LENGTH} characters`);
    }
    if (this.props.content.length > PostContent.MAX_LENGTH) {
      throw new Error(`Content must not exceed ${PostContent.MAX_LENGTH} characters`);
    }
  }
}