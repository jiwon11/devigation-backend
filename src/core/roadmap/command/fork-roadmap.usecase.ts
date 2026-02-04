import { Injectable, Inject } from '@nestjs/common';
import { Result } from '@common/types/result.type';
import { Option } from '@common/types/option.type';
import { Roadmap } from '@domain/roadmap/roadmap';
import { RoadmapId } from '@domain/roadmap/roadmap-id';
import { UserId } from '@domain/user/user-id';
import { RoadmapNotFoundException, RoadmapAccessDeniedException } from '@domain/roadmap/roadmap.exception';
import { ROADMAP_REPOSITORY, RoadmapRepositoryPort } from '../port/out/roadmap-repository.port';
import { NODE_REPOSITORY, NodeRepositoryPort } from '../port/out/node-repository.port';
import { EDGE_REPOSITORY, EdgeRepositoryPort } from '../port/out/edge-repository.port';

export class ForkRoadmapCommand {
  constructor(
    public readonly roadmapId: string,
    public readonly userId: string,
  ) {}
}

@Injectable()
export class ForkRoadmapUseCase {
  constructor(
    @Inject(ROADMAP_REPOSITORY)
    private readonly roadmapRepository: RoadmapRepositoryPort,
    @Inject(NODE_REPOSITORY)
    private readonly nodeRepository: NodeRepositoryPort,
    @Inject(EDGE_REPOSITORY)
    private readonly edgeRepository: EdgeRepositoryPort,
  ) {}

  async execute(command: ForkRoadmapCommand): Promise<Result<Roadmap, Error>> {
    try {
      const roadmapId = RoadmapId.create(command.roadmapId);
      const roadmapOption = await this.roadmapRepository.findById(roadmapId);

      if (!Option.isSome(roadmapOption)) {
        return Result.fail(new RoadmapNotFoundException(command.roadmapId));
      }

      const originalRoadmap = roadmapOption.value;

      // Check if roadmap is public
      if (!originalRoadmap.isPublic()) {
        return Result.fail(new RoadmapAccessDeniedException(command.roadmapId, command.userId));
      }

      // Fork the roadmap
      const forkedRoadmap = originalRoadmap.fork(UserId.create(command.userId));

      // Save forked roadmap
      const savedRoadmap = await this.roadmapRepository.save(forkedRoadmap);

      // Save nodes and edges
      if (forkedRoadmap.nodes.length > 0) {
        await this.nodeRepository.saveMany([...forkedRoadmap.nodes]);
      }
      if (forkedRoadmap.edges.length > 0) {
        await this.edgeRepository.saveMany([...forkedRoadmap.edges]);
      }

      // Update original roadmap fork count
      await this.roadmapRepository.save(originalRoadmap);

      return Result.ok(savedRoadmap);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error(String(error)));
    }
  }
}