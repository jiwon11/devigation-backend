import { Module } from '@nestjs/common';
import { AdminUserController } from './user/admin-user.controller';
import { AdminRoadmapController } from './roadmap/admin-roadmap.controller';
import { AdminPostController } from './post/admin-post.controller';
import { AdminReportController } from './report/admin-report.controller';
import { AdminStatsController } from './stats/admin-stats.controller';
import { CoreModule } from '@core/core.module';

@Module({
  imports: [CoreModule],
  controllers: [
    AdminUserController,
    AdminRoadmapController,
    AdminPostController,
    AdminReportController,
    AdminStatsController,
  ],
})
export class ApiAdminModule {}
