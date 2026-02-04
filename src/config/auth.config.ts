import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwt: {
    secret: process.env['JWT_SECRET'] ?? 'your-super-secret-jwt-key',
    accessTokenExpiresIn: process.env['JWT_ACCESS_TOKEN_EXPIRES_IN'] ?? '15m',
    refreshTokenExpiresIn: process.env['JWT_REFRESH_TOKEN_EXPIRES_IN'] ?? '7d',
    issuer: process.env['JWT_ISSUER'] ?? 'devigation',
    audience: process.env['JWT_AUDIENCE'] ?? 'devigation-api',
  },
  oauth: {
    google: {
      clientId: process.env['GOOGLE_CLIENT_ID'],
      clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
      callbackUrl: process.env['GOOGLE_CALLBACK_URL'],
    },
    github: {
      clientId: process.env['GITHUB_CLIENT_ID'],
      clientSecret: process.env['GITHUB_CLIENT_SECRET'],
      callbackUrl: process.env['GITHUB_CALLBACK_URL'],
    },
    kakao: {
      clientId: process.env['KAKAO_CLIENT_ID'],
      clientSecret: process.env['KAKAO_CLIENT_SECRET'],
      callbackUrl: process.env['KAKAO_CALLBACK_URL'],
    },
  },
  session: {
    secret: process.env['SESSION_SECRET'] ?? 'your-session-secret',
    maxAge: parseInt(process.env['SESSION_MAX_AGE'] ?? '86400000', 10), // 24 hours
  },
}));