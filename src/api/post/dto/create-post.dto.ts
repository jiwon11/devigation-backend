import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsUUID,
  IsUrl,
  MaxLength,
  MinLength,
  ArrayMaxSize,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PostType } from '@domain/post/enums';

export class CreatePostDto {
  @ApiProperty({ example: 'Getting Started with React' })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title!: string;

  @ApiProperty({ example: '# Introduction\n\nReact is a JavaScript library...' })
  @IsString()
  @MinLength(10)
  @MaxLength(100000)
  content!: string;

  @ApiPropertyOptional({ example: 'A beginner-friendly guide to React fundamentals' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  excerpt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  thumbnailUrl?: string;

  @ApiPropertyOptional({ enum: PostType, default: PostType.ARTICLE })
  @IsOptional()
  @IsEnum(PostType)
  type?: PostType;

  @ApiPropertyOptional({ type: [String], example: ['react', 'javascript', 'tutorial'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(10)
  tags?: string[];

  @ApiPropertyOptional({ description: 'Associated roadmap ID' })
  @IsOptional()
  @IsUUID()
  roadmapId?: string;

  @ApiPropertyOptional({ description: 'Associated roadmap node ID' })
  @IsOptional()
  @IsString()
  roadmapNodeId?: string;

  @ApiPropertyOptional({ description: 'Publish immediately', default: false })
  @IsOptional()
  publish?: boolean;
}