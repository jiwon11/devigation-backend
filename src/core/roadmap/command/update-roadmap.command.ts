import { RoadmapCategory } from '@domain/roadmap/roadmap.enum';
import { VisibilityType } from '@domain/roadmap/visibility';

export class UpdateRoadmapCommand {
  constructor(
    public readonly roadmapId: string,
    public readonly userId: string,
    public readonly title?: string,
    public readonly description?: string,
    public readonly category?: RoadmapCategory,
    public readonly visibility?: VisibilityType,
    public readonly tags?: string[],
    public readonly thumbnailUrl?: string,
  ) {}
}