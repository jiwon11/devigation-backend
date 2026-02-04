import { Injectable, Inject } from '@nestjs/common';
import { Result } from '@common/types/result.type';
import { Roadmap } from '@domain/roadmap/roadmap';
import { UserId } from '@domain/user/user-id';
import { CreateRoadmapCommand } from './create-roadmap.command';
import { ROADMAP_REPOSITORY, RoadmapRepositoryPort } from '../port/out/roadmap-repository.port';

@Injectable()
export class CreateRoadmapUseCase {
  constructor(
    @Inject(ROADMAP_REPOSITORY)
    private readonly roadmapRepository: RoadmapRepositoryPort,
  ) {}

  async execute(command: CreateRoadmapCommand): Promise<Result<Roadmap, Error>> {
    try {
      const roadmap = Roadmap.create({
        title: command.title,
        description: command.description,
        category: command.category,
        visibility: command.visibility,
        authorId: UserId.create(command.authorId),
        thumbnailUrl: command.thumbnailUrl,
        tags: command.tags,
      });

      const savedRoadmap = await this.roadmapRepository.save(roadmap);
      return Result.ok(savedRoadmap);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error(String(error)));
    }
  }
}