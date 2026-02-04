import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from '@common/common.module';
import { DomainModule } from '@domain/domain.module';
import { CoreModule } from '@core/core.module';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { ApiModule } from '@api/api.module';
import { ApiAdminModule } from '@api-admin/api-admin.module';
import { ConfigurationModule } from '@config/config.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    ConfigurationModule,
    CommonModule,
    DomainModule,
    CoreModule,
    InfrastructureModule,
    ApiModule,
    ApiAdminModule,
  ],
})
export class AppModule {}