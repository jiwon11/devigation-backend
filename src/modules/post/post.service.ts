import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createPostDto: CreatePostDto) {
    const slug = await this.generateSlug(createPostDto.title);

    return this.prisma.post.create({
      data: {
        ...createPostDto,
        slug,
        userId,
        publishedAt: createPostDto.isPublished ? new Date() : null,
      },
      include: {
        user: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
      },
    });
  }

  async findAll(options: { tag?: string; page?: number; limit?: number } = {}) {
    const { tag, page = 1, limit = 20 } = options;

    const where = {
      isPublished: true,
      ...(tag && { tags: { has: tag } }),
    };

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        include: {
          user: {
            select: { id: true, username: true, displayName: true, avatarUrl: true },
          },
        },
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      data: posts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.post.findUnique({
      where: { slug },
      include: {
        user: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
        roadmap: {
          select: { id: true, title: true },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Increment view count
    await this.prisma.post.update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
    });

    return post;
  }

  async update(id: string, userId: string, updatePostDto: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({ where: { id } });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.userId !== userId) {
      throw new ForbiddenException('Not authorized');
    }

    const data: any = { ...updatePostDto };

    // Handle publishing
    if (updatePostDto.isPublished && !post.isPublished) {
      data.publishedAt = new Date();
    }

    return this.prisma.post.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, userId: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.userId !== userId) {
      throw new ForbiddenException('Not authorized');
    }

    return this.prisma.post.delete({ where: { id } });
  }

  async like(id: string, userId: string) {
    const existing = await this.prisma.like.findUnique({
      where: { userId_postId: { userId, postId: id } },
    });

    if (existing) {
      // Remove like
      await this.prisma.like.delete({
        where: { userId_postId: { userId, postId: id } },
      });
      await this.prisma.post.update({
        where: { id },
        data: { likeCount: { decrement: 1 } },
      });
      return { liked: false };
    } else {
      // Add like
      await this.prisma.like.create({
        data: { userId, postId: id },
      });
      await this.prisma.post.update({
        where: { id },
        data: { likeCount: { increment: 1 } },
      });
      return { liked: true };
    }
  }

  private async generateSlug(title: string): Promise<string> {
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);

    let slug = baseSlug;
    let counter = 0;

    while (true) {
      const existing = await this.prisma.post.findUnique({ where: { slug } });
      if (!existing) break;
      counter++;
      slug = `${baseSlug}-${counter}`;
    }

    return slug;
  }
}
