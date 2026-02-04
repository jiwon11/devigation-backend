# Devigation Backend

> 개발자의 성장을 위한 로드맵 플랫폼 - 백엔드

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20_LTS-339933?style=for-the-badge&logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/NestJS-10-E0234E?style=for-the-badge&logo=nestjs" alt="NestJS" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker" alt="Docker" />
  <img src="https://img.shields.io/badge/Railway-Deploy-0B0D0E?style=for-the-badge&logo=railway" alt="Railway" />
</p>

## 📋 프로젝트 소개

Devigation 백엔드는 Docker와 Docker Compose를 기반으로 구축된 마이크로서비스 아키텍처입니다. NestJS 프레임워크, PostgreSQL, Redis를 활용하여 확장 가능하고 유지보수가 용이한 구조를 제공합니다.

### 주요 기능

- **사용자 관리**: OAuth 인증 (GitHub, Google), JWT 토큰 기반 인증
- **로드맵 CRUD**: 로드맵 생성, 수정, 삭제, Fork
- **게시글 관리**: 마크다운 포스트, 태그, 카테고리
- **소셜 기능**: 팔로우, 좋아요, 댓글, 북마크
- **실시간**: WebSocket 기반 알림, 채팅
- **분석**: 활동 지표, 통계
- **캐싱**: Redis 기반 성능 최적화

## 🛠 기술 스택

| 카테고리 | 기술 |
|---------|------|
| Runtime | Node.js 20 LTS |
| Framework | NestJS 10 |
| Language | TypeScript 5.0+ |
| Database | PostgreSQL 16 |
| ORM | Prisma |
| Cache | Redis 7 |
| Auth | Passport.js, JWT |
| Realtime | Socket.IO |
| Container | Docker, Docker Compose |
| Deploy | Railway (무료) |
| Testing | Jest, Supertest |
| Documentation | Swagger (OpenAPI 3.0) |

## 🚀 Railway 무료 배포 (권장)

Railway는 **월 $5 무료 크레딧**을 제공하여 프로토타입/MVP 단계에서 **완전 무료**로 사용 가능합니다.

### 빠른 배포 (5분)

```bash
# 1. Railway CLI 설치
npm install -g @railway/cli

# 2. 로그인
railway login

# 3. 프로젝트 생성 & 연결
railway init

# 4. PostgreSQL 추가 (무료)
railway add --name postgres

# 5. Redis 추가 (무료)
railway add --name redis

# 6. 환경변수 설정 (Railway 대시보드 또는 CLI)
railway variables set DATABASE_URL=${{Postgres.DATABASE_URL}}
railway variables set REDIS_URL=${{Redis.REDIS_URL}}
railway variables set JWT_SECRET=your-secret-key
railway variables set NODE_ENV=production

# 7. 배포
railway up
```

### Railway 대시보드 설정

1. [railway.app](https://railway.app) 접속 → GitHub 로그인
2. **New Project** → **Deploy from GitHub repo** 선택
3. `devigation-backend` 리포지토리 연결
4. **Add Database** → PostgreSQL, Redis 추가
5. **Variables** 탭에서 환경변수 설정
6. 자동 배포 완료! 🎉

### 무료 티어 사양

| 리소스 | 무료 제공량 | 프로토타입 충분? |
|--------|------------|----------------|
| 실행 시간 | $5 크레딧/월 | ✅ 충분 |
| PostgreSQL | 1GB 스토리지 | ✅ 충분 |
| Redis | 256MB 메모리 | ✅ 충분 |
| 대역폭 | 100GB/월 | ✅ 충분 |
| 도메인 | *.up.railway.app | ✅ 제공 |

### railway.json 설정

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile.prod"
  },
  "deploy": {
    "startCommand": "node dist/main.js",
    "healthcheckPath": "/health",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

## 🏗 아키텍처

### DDD + Clean Architecture (Docker 기반)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Docker Compose                                   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                        Nginx (Reverse Proxy)                     │   │
│  │                         Port: 80, 443                            │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                    │                                     │
│       ┌────────────────────────────┼────────────────────────────┐       │
│       │                            │                            │       │
│  ┌────▼────┐    ┌─────────────────▼───────────────────┐   ┌────▼────┐ │
│  │   API   │    │            API Server               │   │ Socket  │ │
│  │  Docs   │    │         (NestJS App)                │   │   IO    │ │
│  │ :3001   │    │            :3000                    │   │  :3002  │ │
│  └─────────┘    └─────────────────────────────────────┘   └─────────┘ │
│                                    │                                     │
│       ┌────────────────────────────┼────────────────────────────┐       │
│       │                            │                            │       │
│  ┌────▼────┐              ┌───────▼───────┐              ┌─────▼────┐  │
│  │  Redis  │              │  PostgreSQL   │              │  MinIO   │  │
│  │  :6379  │              │    :5432      │              │  :9000   │  │
│  └─────────┘              └───────────────┘              └──────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

### 레이어드 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │ Controllers │ │   Guards    │ │     Interceptors    │   │
│  └─────────────┘ └─────────────┘ └─────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                    Application Layer                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Services / Use Cases                    │   │
│  └─────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                      Domain Layer                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐   │
│  │   User   │ │ Roadmap  │ │   Post   │ │   Activity   │   │
│  │  Module  │ │  Module  │ │  Module  │ │    Module    │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                   Infrastructure Layer                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │   Prisma    │ │    Redis    │ │      External       │   │
│  │    ORM      │ │    Cache    │ │        APIs         │   │
│  └─────────────┘ └─────────────┘ └─────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## 📁 프로젝트 구조

```
backend/
├── docker/
│   ├── nginx/
│   │   └── nginx.conf              # Nginx 설정
│   ├── postgres/
│   │   └── init.sql                # DB 초기화 스크립트
│   └── redis/
│       └── redis.conf              # Redis 설정
├── prisma/
│   ├── schema.prisma               # Prisma 스키마
│   ├── migrations/                 # DB 마이그레이션
│   └── seed.ts                     # 시드 데이터
├── src/
│   ├── common/                     # 공통 모듈
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── pipes/
│   ├── config/                     # 설정 모듈
│   │   ├── database.config.ts
│   │   ├── redis.config.ts
│   │   └── jwt.config.ts
│   ├── modules/
│   │   ├── auth/                   # 인증 모듈
│   │   ├── user/                   # 사용자 모듈
│   │   ├── roadmap/                # 로드맵 모듈
│   │   ├── post/                   # 게시글 모듈
│   │   ├── activity/               # 활동 모듈
│   │   └── notification/           # 알림 모듈
│   ├── prisma/
│   │   └── prisma.service.ts       # Prisma 서비스
│   ├── app.module.ts
│   └── main.ts
├── test/
│   ├── unit/
│   └── e2e/
├── .env.example
├── docker-compose.yml              # 개발용
├── docker-compose.prod.yml         # 프로덕션용
├── Dockerfile
├── Dockerfile.prod
├── railway.json                    # Railway 설정
├── package.json
└── tsconfig.json
```

## 🐳 Docker 로컬 개발

### 빠른 시작 (Docker)

```bash
# 저장소 클론
git clone https://github.com/jiwon11/devigation-backend.git
cd devigation-backend

# 환경 변수 설정
cp .env.example .env.development

# Docker Compose로 실행
docker-compose up -d

# 마이그레이션 실행
docker-compose exec api pnpm prisma migrate dev

# 시드 데이터 적용
docker-compose exec api pnpm prisma db seed
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: devigation-api
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://devigation:devigation@postgres:5432/devigation
      - REDIS_URL=redis://redis:6379
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      - postgres
      - redis
    networks:
      - devigation-network

  postgres:
    image: postgres:16-alpine
    container_name: devigation-postgres
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=devigation
      - POSTGRES_PASSWORD=devigation
      - POSTGRES_DB=devigation
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - devigation-network

  redis:
    image: redis:7-alpine
    container_name: devigation-redis
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - devigation-network

  minio:
    image: minio/minio:latest
    container_name: devigation-minio
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      - MINIO_ROOT_USER=devigation
      - MINIO_ROOT_PASSWORD=devigation123
    volumes:
      - minio-data:/data
    command: server /data --console-address ":9001"
    networks:
      - devigation-network

volumes:
  postgres-data:
  redis-data:
  minio-data:

networks:
  devigation-network:
    driver: bridge
```

### Docker 명령어

```bash
# 전체 서비스 시작
docker-compose up -d

# 로그 확인
docker-compose logs -f api

# 특정 서비스 재시작
docker-compose restart api

# 전체 서비스 중지
docker-compose down

# 볼륨 포함 삭제
docker-compose down -v

# 프로덕션 빌드 & 실행
docker-compose -f docker-compose.prod.yml up -d --build
```

## 🔧 환경 변수

```env
# App
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://devigation:devigation@localhost:5432/devigation

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d

# OAuth - GitHub
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_CALLBACK_URL=http://localhost:3000/auth/github/callback

# OAuth - Google
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# Storage (MinIO / Cloudflare R2)
STORAGE_ENDPOINT=localhost
STORAGE_PORT=9000
STORAGE_ACCESS_KEY=devigation
STORAGE_SECRET_KEY=devigation123
STORAGE_BUCKET=devigation

# Frontend URL
FRONTEND_URL=http://localhost:3001
```

## 📜 API 엔드포인트

### 인증 (Auth)

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/auth/github` | GitHub OAuth 로그인 |
| GET | `/auth/github/callback` | GitHub 콜백 |
| GET | `/auth/google` | Google OAuth 로그인 |
| GET | `/auth/google/callback` | Google 콜백 |
| POST | `/auth/refresh` | 토큰 갱신 |
| POST | `/auth/logout` | 로그아웃 |

### 사용자 (Users)

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/users/me` | 내 정보 조회 |
| PATCH | `/users/me` | 내 정보 수정 |
| GET | `/users/:username` | 사용자 프로필 조회 |
| GET | `/users/:id/activities` | 활동 내역 조회 |
| POST | `/users/:id/follow` | 팔로우 |
| DELETE | `/users/:id/follow` | 언팔로우 |

### 로드맵 (Roadmaps)

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/roadmaps` | 로드맵 목록 조회 |
| GET | `/roadmaps/:id` | 로드맵 상세 조회 |
| POST | `/roadmaps` | 로드맵 생성 |
| PATCH | `/roadmaps/:id` | 로드맵 수정 |
| DELETE | `/roadmaps/:id` | 로드맵 삭제 |
| POST | `/roadmaps/:id/fork` | 로드맵 Fork |
| POST | `/roadmaps/:id/star` | 로드맵 Star |

### 게시글 (Posts)

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/posts` | 게시글 목록 조회 |
| GET | `/posts/:id` | 게시글 상세 조회 |
| POST | `/posts` | 게시글 작성 |
| PATCH | `/posts/:id` | 게시글 수정 |
| DELETE | `/posts/:id` | 게시글 삭제 |
| POST | `/posts/:id/like` | 좋아요 |
| DELETE | `/posts/:id/like` | 좋아요 취소 |

### API 문서

- **로컬**: http://localhost:3000/api/docs
- **Railway**: https://your-app.up.railway.app/api/docs

## 💰 비용 비교

| 단계 | 서비스 | 월 비용 | 비고 |
|------|--------|--------|------|
| **프로토타입** | Vercel + Railway (무료) | **$0** | MVP 개발 단계 |
| **초기 런칭** | Vercel + Railway (Hobby) | **$5** | 24시간 가동 |
| **스케일업** | Vercel Pro + Railway Pro | **$40** | MAU 10,000+ |

## 🧪 테스트

```bash
# 단위 테스트
pnpm test

# E2E 테스트
pnpm test:e2e

# 테스트 커버리지
pnpm test:cov

# Docker 환경에서 테스트
docker-compose exec api pnpm test
```

## 🔗 관련 저장소

- [Frontend Repository](https://github.com/jiwon11/devigation-frontend)

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참고하세요.

---

<p align="center">
  Made with ❤️ by Devigation Team
</p>
