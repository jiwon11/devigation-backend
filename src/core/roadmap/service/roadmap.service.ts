import { Injectable, Inject } from '@nestjs/common';
import { Option } from '@common/types/option.type';
import { RoadmapId } from '@domain/roadmap/roadmap-id';
import { Roadmap } from '@domain/roadmap/roadmap';
import { ROADMAP_REPOSITORY, RoadmapRepositoryPort } from '../port/out/roadmap-repository.port';

@Injectable()
export class RoadmapService {
  constructor(
    @Inject(ROADMAP_REPOSITORY)
    private readonly roadmapRepository: RoadmapRepositoryPort,
  ) {}

  async getRoadmapById(roadmapId: string): Promise<Roadmap | null> {
    const roadmapOption = await this.roadmapRepository.findById(
      RoadmapId.create(roadmapId),
    );
    return Option.isSome(roadmapOption) ? roadmapOption.value : null;
  }
}