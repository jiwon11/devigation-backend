import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SupabaseAuthAdapter } from './supabase-auth.adapter';
import { SupabaseJwtStrategy } from './supabase-jwt.strategy';
import { TOKEN_PROVIDER } from '@core/auth/port/out/token-provider.port';
import { SOCIAL_AUTH } from '@core/auth/port/out/social-auth.port';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  providers: [
    SupabaseJwtStrategy,
    { provide: TOKEN_PROVIDER, useClass: SupabaseAuthAdapter },
    { provide: SOCIAL_AUTH, useClass: SupabaseAuthAdapter },
  ],
  exports: [TOKEN_PROVIDER, SOCIAL_AUTH],
})
export class AuthInfraModule {}