import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export const ACTIVITY_WEIGHTS = {
  post: 100,
  roadmap: 300,
  comment: 10,
  like: 1,
  chat: 1,
} as const;

export type ActivityType = keyof typeof ACTIVITY_WEIGHTS;

@Injectable()
export class ActivityService {
  constructor(private prisma: PrismaService) {}

  async logActivity(userId: string, activityType: ActivityType, targetId?: string, targetType?: string) {
    const score = ACTIVITY_WEIGHTS[activityType];

    return this.prisma.activity.create({
      data: {
        userId,
        activityType,
        targetId,
        targetType,
        score,
      },
    });
  }

  async getUserActivities(userId: string, options: { page?: number; limit?: number } = {}) {
    const { page = 1, limit = 20 } = options;

    const [activities, total] = await Promise.all([
      this.prisma.activity.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.activity.count({ where: { userId } }),
    ]);

    return {
      data: activities,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserActivityStats(userId: string) {
    const stats = await this.prisma.activity.groupBy({
      by: ['activityType'],
      where: { userId },
      _count: { id: true },
      _sum: { score: true },
    });

    const totalScore = stats.reduce((sum, stat) => sum + (stat._sum.score || 0), 0);

    const breakdown = stats.map((stat) => ({
      type: stat.activityType,
      count: stat._count.id,
      score: stat._sum.score || 0,
      percentage: totalScore > 0 ? ((stat._sum.score || 0) / totalScore) * 100 : 0,
    }));

    return {
      totalScore,
      level: this.calculateLevel(totalScore),
      breakdown,
    };
  }

  private calculateLevel(score: number): number {
    return Math.floor(Math.sqrt(score / 100)) + 1;
  }
}
