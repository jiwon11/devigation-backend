import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  env: process.env['NODE_ENV'] ?? 'development',
  name: process.env['APP_NAME'] ?? 'Devigation',
  port: parseInt(process.env['PORT'] ?? '3000', 10),
  apiPrefix: process.env['API_PREFIX'] ?? 'api',
  apiVersion: process.env['API_VERSION'] ?? 'v1',
  frontendUrl: process.env['FRONTEND_URL'] ?? 'http://localhost:3001',
  corsOrigins: (process.env['CORS_ORIGINS'] ?? 'http://localhost:3001').split(','),
  rateLimitTtl: parseInt(process.env['RATE_LIMIT_TTL'] ?? '60', 10),
  rateLimitMax: parseInt(process.env['RATE_LIMIT_MAX'] ?? '100', 10),
  swagger: {
    enabled: process.env['SWAGGER_ENABLED'] === 'true',
    title: process.env['SWAGGER_TITLE'] ?? 'Devigation API',
    description: process.env['SWAGGER_DESCRIPTION'] ?? 'Devigation Backend API Documentation',
    version: process.env['SWAGGER_VERSION'] ?? '1.0',
  },
  logging: {
    level: process.env['LOG_LEVEL'] ?? 'info',
    prettyPrint: process.env['LOG_PRETTY_PRINT'] === 'true',
  },
}));