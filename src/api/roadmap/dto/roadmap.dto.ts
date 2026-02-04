import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoadmapVisibility, RoadmapStatus, DifficultyLevel, NodeType } from '@domain/roadmap/enums';
import { UserSummaryDto } from '@api/user/dto';

export class NodePositionDto {
  @ApiProperty()
  x!: number;

  @ApiProperty()
  y!: number;
}

export class NodeStyleDto {
  @ApiPropertyOptional()
  backgroundColor?: string;

  @ApiPropertyOptional()
  borderColor?: string;

  @ApiPropertyOptional()
  textColor?: string;

  @ApiPropertyOptional()
  borderRadius?: number;

  @ApiPropertyOptional()
  borderWidth?: number;
}

export class RoadmapNodeDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: NodeType })
  type!: NodeType;

  @ApiProperty()
  title!: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ type: NodePositionDto })
  position!: NodePositionDto;

  @ApiPropertyOptional({ type: NodeStyleDto })
  style?: NodeStyleDto;

  @ApiPropertyOptional()
  resourceUrl?: string;

  @ApiPropertyOptional()
  estimatedTime?: number;

  @ApiProperty()
  order!: number;

  @ApiPropertyOptional()
  parentId?: string;
}

export class RoadmapEdgeDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  sourceId!: string;

  @ApiProperty()
  targetId!: string;

  @ApiPropertyOptional()
  label?: string;

  @ApiPropertyOptional()
  style?: string;
}

export class RoadmapDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  thumbnailUrl?: string;

  @ApiProperty({ enum: RoadmapVisibility })
  visibility!: RoadmapVisibility;

  @ApiProperty({ enum: RoadmapStatus })
  status!: RoadmapStatus;

  @ApiProperty({ enum: DifficultyLevel })
  difficulty!: DifficultyLevel;

  @ApiProperty({ type: [String] })
  tags!: string[];

  @ApiProperty({ type: [RoadmapNodeDto] })
  nodes!: RoadmapNodeDto[];

  @ApiProperty({ type: [RoadmapEdgeDto] })
  edges!: RoadmapEdgeDto[];

  @ApiProperty({ type: UserSummaryDto })
  author!: UserSummaryDto;

  @ApiProperty()
  viewCount!: number;

  @ApiProperty()
  likeCount!: number;

  @ApiProperty()
  bookmarkCount!: number;

  @ApiProperty()
  forkCount!: number;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiPropertyOptional()
  forkedFromId?: string;

  @ApiPropertyOptional()
  isLiked?: boolean;

  @ApiPropertyOptional()
  isBookmarked?: boolean;
}

export class RoadmapSummaryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  thumbnailUrl?: string;

  @ApiProperty({ enum: DifficultyLevel })
  difficulty!: DifficultyLevel;

  @ApiProperty({ type: [String] })
  tags!: string[];

  @ApiProperty({ type: UserSummaryDto })
  author!: UserSummaryDto;

  @ApiProperty()
  nodeCount!: number;

  @ApiProperty()
  viewCount!: number;

  @ApiProperty()
  likeCount!: number;

  @ApiProperty()
  bookmarkCount!: number;

  @ApiProperty()
  createdAt!: Date;
}