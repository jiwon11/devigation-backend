import { Injectable, Inject } from '@nestjs/common';
import { Result } from '@common/types/result.type';
import { Option } from '@common/types/option.type';
import { RoadmapNode } from '@domain/roadmap/roadmap-node';
import { RoadmapId } from '@domain/roadmap/roadmap-id';
import { UserId } from '@domain/user/user-id';
import { Position } from '@domain/roadmap/position';
import { NodeType } from '@domain/roadmap/roadmap.enum';
import { RoadmapNotFoundException, RoadmapAccessDeniedException } from '@domain/roadmap/roadmap.exception';
import { ROADMAP_REPOSITORY, RoadmapRepositoryPort } from '../port/out/roadmap-repository.port';
import { NODE_REPOSITORY, NodeRepositoryPort } from '../port/out/node-repository.port';

export class AddNodeCommand {
  constructor(
    public readonly roadmapId: string,
    public readonly userId: string,
    public readonly title: string,
    public readonly type: NodeType,
    public readonly positionX: number,
    public readonly positionY: number,
    public readonly description?: string,
    public readonly resourceUrl?: string,
  ) {}
}

@Injectable()
export class AddNodeUseCase {
  constructor(
    @Inject(ROADMAP_REPOSITORY)
    private readonly roadmapRepository: RoadmapRepositoryPort,
    @Inject(NODE_REPOSITORY)
    private readonly nodeRepository: NodeRepositoryPort,
  ) {}

  async execute(command: AddNodeCommand): Promise<Result<RoadmapNode, Error>> {
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

      const node = RoadmapNode.create({
        roadmapId,
        title: command.title,
        type: command.type,
        position: Position.create(command.positionX, command.positionY),
        description: command.description,
        resourceUrl: command.resourceUrl,
      });

      roadmap.addNode(node);
      await this.roadmapRepository.save(roadmap);

      const savedNode = await this.nodeRepository.save(node);
      return Result.ok(savedNode);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error(String(error)));
    }
  }
}