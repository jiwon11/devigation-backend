import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsNumber,
  IsUrl,
  ValidateNested,
  MaxLength,
  MinLength,
  ArrayMaxSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoadmapVisibility, DifficultyLevel, NodeType } from '@domain/roadmap/enums';

export class CreateNodePositionDto {
  @ApiProperty()
  @IsNumber()
  x!: number;

  @ApiProperty()
  @IsNumber()
  y!: number;
}

export class CreateNodeStyleDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  backgroundColor?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  borderColor?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  textColor?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  borderRadius?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  borderWidth?: number;
}

export class CreateNodeDto {
  @ApiProperty()
  @IsString()
  id!: string;

  @ApiProperty({ enum: NodeType })
  @IsEnum(NodeType)
  type!: NodeType;

  @ApiProperty()
  @IsString()
  @MaxLength(200)
  title!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiProperty({ type: CreateNodePositionDto })
  @ValidateNested()
  @Type(() => CreateNodePositionDto)
  position!: CreateNodePositionDto;

  @ApiPropertyOptional({ type: CreateNodeStyleDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateNodeStyleDto)
  style?: CreateNodeStyleDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  resourceUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  estimatedTime?: number;

  @ApiProperty()
  @IsNumber()
  order!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  parentId?: string;
}

export class CreateEdgeDto {
  @ApiProperty()
  @IsString()
  id!: string;

  @ApiProperty()
  @IsString()
  sourceId!: string;

  @ApiProperty()
  @IsString()
  targetId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  label?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  style?: string;
}

export class CreateRoadmapDto {
  @ApiProperty({ example: 'Frontend Developer Roadmap' })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title!: string;

  @ApiPropertyOptional({ example: 'A comprehensive guide to becoming a frontend developer' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  thumbnailUrl?: string;

  @ApiPropertyOptional({ enum: RoadmapVisibility, default: RoadmapVisibility.PUBLIC })
  @IsOptional()
  @IsEnum(RoadmapVisibility)
  visibility?: RoadmapVisibility;

  @ApiPropertyOptional({ enum: DifficultyLevel, default: DifficultyLevel.BEGINNER })
  @IsOptional()
  @IsEnum(DifficultyLevel)
  difficulty?: DifficultyLevel;

  @ApiPropertyOptional({ type: [String], example: ['frontend', 'javascript', 'react'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(10)
  tags?: string[];

  @ApiPropertyOptional({ type: [CreateNodeDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateNodeDto)
  nodes?: CreateNodeDto[];

  @ApiPropertyOptional({ type: [CreateEdgeDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEdgeDto)
  edges?: CreateEdgeDto[];
}