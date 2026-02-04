import { Injectable, Inject } from '@nestjs/common';
import { Result } from '@common/types/result.type';
import { Post } from '@domain/post/post';
import { UserId } from '@domain/user/user-id';
import { RoadmapId } from '@domain/roadmap/roadmap-id';
import { NodeId } from '@domain/roadmap/node-id';
import { POST_REPOSITORY, PostRepositoryPort } from '../port/out/post-repository.port';

export class CreatePostCommand {
  constructor(
    public readonly authorId: string,
    public readonly title: string,
    public readonly content: string,
    public readonly excerpt?: string,
    public readonly thumbnailUrl?: string,
    public readonly roadmapId?: string,
    public readonly nodeId?: string,
    public readonly tags?: string[],
  ) {}
}

@Injectable()
export class CreatePostUseCase {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepository: PostRepositoryPort,
  ) {}

  async execute(command: CreatePostCommand): Promise<Result<Post, Error>> {
    try {
      const post = Post.create({
        title: command.title,
        content: command.content,
        authorId: UserId.create(command.authorId),
        excerpt: command.excerpt,
        thumbnailUrl: command.thumbnailUrl,
        roadmapId: command.roadmapId !== undefined ? RoadmapId.create(command.roadmapId) : undefined,
        nodeId: command.nodeId !== undefined ? NodeId.create(command.nodeId) : undefined,
        tags: command.tags,
      });

      const savedPost = await this.postRepository.save(post);
      return Result.ok(savedPost);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error(String(error)));
    }
  }
}