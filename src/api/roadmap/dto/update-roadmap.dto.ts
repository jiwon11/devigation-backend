import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateRoadmapDto, CreateNodeDto, CreateEdgeDto } from './create-roadmap.dto';
import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRoadmapDto extends PartialType(
  OmitType(CreateRoadmapDto, ['nodes', 'edges'] as const),
) {}

export class UpdateNodesDto {
  @ApiPropertyOptional({ type: [CreateNodeDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateNodeDto)
  add?: CreateNodeDto[];

  @ApiPropertyOptional({ type: [CreateNodeDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateNodeDto)
  update?: CreateNodeDto[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  remove?: string[];
}

export class UpdateEdgesDto {
  @ApiPropertyOptional({ type: [CreateEdgeDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEdgeDto)
  add?: CreateEdgeDto[];

  @ApiPropertyOptional({ type: [CreateEdgeDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEdgeDto)
  update?: CreateEdgeDto[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  remove?: string[];
}

export class UpdateRoadmapGraphDto {
  @ApiPropertyOptional({ type: UpdateNodesDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateNodesDto)
  nodes?: UpdateNodesDto;

  @ApiPropertyOptional({ type: UpdateEdgesDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateEdgesDto)
  edges?: UpdateEdgesDto;
}