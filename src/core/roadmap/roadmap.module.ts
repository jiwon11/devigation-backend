import { Module } from '@nestjs/common';
import { CreateRoadmapUseCase } from './command/create-roadmap.usecase';
import { UpdateRoadmapUseCase } from './command/update-roadmap.usecase';
import { DeleteRoadmapUseCase } from './command/delete-roadmap.usecase';
import { ForkRoadmapUseCase } from './command/fork-roadmap.usecase';
import { AddNodeUseCase } from './command/add-node.usecase';
import { GetRoadmapUseCase } from './query/get-roadmap.usecase';
import { ListRoadmapsUseCase } from './query/list-roadmaps.usecase';
import { RoadmapService } from './service/roadmap.service';
import { ForkService } from './service/fork.service';

@Module({
  providers: [
    CreateRoadmapUseCase,
    UpdateRoadmapUseCase,
    DeleteRoadmapUseCase,
    ForkRoadmapUseCase,
    AddNodeUseCase,
    GetRoadmapUseCase,
    ListRoadmapsUseCase,
    RoadmapService,
    ForkService,
  ],
  exports: [
    CreateRoadmapUseCase,
    UpdateRoadmapUseCase,
    DeleteRoadmapUseCase,
    ForkRoadmapUseCase,
    AddNodeUseCase,
    GetRoadmapUseCase,
    ListRoadmapsUseCase,
    RoadmapService,
    ForkService,
  ],
})
export class RoadmapModule {}