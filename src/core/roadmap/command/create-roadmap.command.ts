import { RoadmapCategory } from '@domain/roadmap/roadmap.enum';
import { VisibilityType } from '@domain/roadmap/visibility';

export class CreateRoadmapCommand {
  constructor(
    public readonly authorId: string,
    public readonly title: string,
    public readonly category: RoadmapCategory,
    public readonly description?: string,
    public readonly visibility?: VisibilityType,
    public readonly tags?: string[],
    public readonly thumbnailUrl?: string,
  ) {}
}