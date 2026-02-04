import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRoadmapDto } from './dto/create-roadmap.dto';
import { UpdateRoadmapDto } from './dto/update-roadmap.dto';

@Injectable()
export class RoadmapService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createRoadmapDto: CreateRoadmapDto) {
    return this.prisma.roadmap.create({
      data: {
        ...createRoadmapDto,
        userId,
      },
      include: {
        user: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
      },
    });
  }

  async findAll(options: { category?: string; page?: number; limit?: number } = {}) {
    const { category, page = 1, limit = 20 } = options;

    const where = {
      isPublic: true,
      ...(category && { category }),
    };

    const [roadmaps, total] = await Promise.all([
      this.prisma.roadmap.findMany({
        where,
        include: {
          user: {
            select: { id: true, username: true, displayName: true, avatarUrl: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.roadmap.count({ where }),
    ]);

    return {
      data: roadmaps,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const roadmap = await this.prisma.roadmap.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
        posts: {
          where: { isPublished: true },
          select: { id: true, title: true, slug: true, nodeId: true },
        },
      },
    });

    if (!roadmap) {
      throw new NotFoundException('Roadmap not found');
    }

    // Increment view count
    await this.prisma.roadmap.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return roadmap;
  }

  async update(id: string, userId: string, updateRoadmapDto: UpdateRoadmapDto) {
    const roadmap = await this.prisma.roadmap.findUnique({ where: { id } });

    if (!roadmap) {
      throw new NotFoundException('Roadmap not found');
    }

    if (roadmap.userId !== userId) {
      throw new ForbiddenException('Not authorized');
    }

    return this.prisma.roadmap.update({
      where: { id },
      data: updateRoadmapDto,
    });
  }

  async remove(id: string, userId: string) {
    const roadmap = await this.prisma.roadmap.findUnique({ where: { id } });

    if (!roadmap) {
      throw new NotFoundException('Roadmap not found');
    }

    if (roadmap.userId !== userId) {
      throw new ForbiddenException('Not authorized');
    }

    return this.prisma.roadmap.delete({ where: { id } });
  }

  async fork(id: string, userId: string) {
    const original = await this.prisma.roadmap.findUnique({ where: { id } });

    if (!original) {
      throw new NotFoundException('Roadmap not found');
    }

    // Create forked roadmap
    const forked = await this.prisma.roadmap.create({
      data: {
        userId,
        title: `${original.title} (Fork)`,
        description: original.description,
        category: original.category,
        nodes: original.nodes,
        edges: original.edges,
        forkedFrom: original.id,
      },
    });

    // Increment fork count
    await this.prisma.roadmap.update({
      where: { id },
      data: { forkCount: { increment: 1 } },
    });

    return forked;
  }

  async star(id: string, userId: string) {
    const existing = await this.prisma.star.findUnique({
      where: { userId_roadmapId: { userId, roadmapId: id } },
    });

    if (existing) {
      // Remove star
      await this.prisma.star.delete({
        where: { userId_roadmapId: { userId, roadmapId: id } },
      });
      await this.prisma.roadmap.update({
        where: { id },
        data: { starCount: { decrement: 1 } },
      });
      return { starred: false };
    } else {
      // Add star
      await this.prisma.star.create({
        data: { userId, roadmapId: id },
      });
      await this.prisma.roadmap.update({
        where: { id },
        data: { starCount: { increment: 1 } },
      });
      return { starred: true };
    }
  }
}
