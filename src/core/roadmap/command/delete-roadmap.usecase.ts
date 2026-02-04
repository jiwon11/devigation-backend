import { Injectable, Inject } from '@nestjs/common';
import { Result } from '@common/types/result.type';
import { Option } from '@common/types/option.type';
import { RoadmapId } from '@domain/roadmap/roadmap-id';
import { UserId } from '@domain/user/user-id';
import { RoadmapNotFoundException, RoadmapAccessDeniedException } from '@domain/roadmap/roadmap.exception';
import { ROADMAP_REPOSITORY, RoadmapRepositoryPort } from '../port/out/roadmap-repository.port';
import { NODE_REPOSITORY, NodeRepositoryPort } from '../port/out/node-repository.port';
import { EDGE_REPOSITORY, EdgeRepositoryPort } from '../port/out/edge-repository.port';

export class DeleteRoadmapCommand {
  constructor(
    public readonly roadmapId: string,
    public readonly userId: string,
  ) {}
}

@Injectable()
export class DeleteRoadmapUseCase {
  constructor(
    @Inject(ROADMAP_REPOSITORY)
    private readonly roadmapRepository: RoadmapRepositoryPort,
    @Inject(NODE_REPOSITORY)
    private readonly nodeRepository: NodeRepositoryPort,
    @Inject(EDGE_REPOSITORY)
    private readonly edgeRepository: EdgeRepositoryPort,
  ) {}

  async execute(command: DeleteRoadmapCommand): Promise<Result<void, Error>> {
    try {
      const roadmapId = RoadmapId.create(command.roadmapId);
      const roadmapOption = await this.roadmapRepository.findById(roadmapId);

      if (!Option.isSome(roadmapOption)) {
        return Result.fail(new RoadmapNotFoundException(command.roadmapId));
      }

      const roadmap = roadmapOption.value;
      const userId = UserId.create(command.userId);

      if (!roadmap.isOwnedBy(userId)) {
        return Result.fail(new RoadmapAccessDeniedException(command.roadmapId, command.userId));
      }

      // Delete edges and nodes first
      await this.edgeRepository.deleteByRoadmapId(roadmapId);
      await this.nodeRepository.deleteByRoadmapId(roadmapId);
      await this.roadmapRepository.delete(roadmapId);

      return Result.ok(undefined);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error(String(error)));
    }
  }
}