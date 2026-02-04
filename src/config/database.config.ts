import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  supabase: {
    url: process.env['SUPABASE_URL'],
    anonKey: process.env['SUPABASE_ANON_KEY'],
    serviceRoleKey: process.env['SUPABASE_SERVICE_ROLE_KEY'],
    jwtSecret: process.env['SUPABASE_JWT_SECRET'],
  },
  postgres: {
    host: process.env['DATABASE_HOST'] ?? 'localhost',
    port: parseInt(process.env['DATABASE_PORT'] ?? '5432', 10),
    username: process.env['DATABASE_USERNAME'] ?? 'postgres',
    password: process.env['DATABASE_PASSWORD'] ?? 'postgres',
    database: process.env['DATABASE_NAME'] ?? 'devigation',
    ssl: process.env['DATABASE_SSL'] === 'true',
    poolMin: parseInt(process.env['DATABASE_POOL_MIN'] ?? '2', 10),
    poolMax: parseInt(process.env['DATABASE_POOL_MAX'] ?? '10', 10),
  },
}));