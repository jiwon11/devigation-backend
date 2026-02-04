# Devigation Backend

> 개발자의 성장을 위한 로드맵 플랫폼 - 백엔드

<p align="center">
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/Edge_Functions-Deno-black?style=for-the-badge&logo=deno" alt="Edge Functions" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Architecture-DDD-purple?style=for-the-badge" alt="DDD" />
</p>

## 📋 프로젝트 소개

Devigation 백엔드는 Supabase를 기반으로 구축된 서버리스 아키텍처입니다. PostgreSQL 데이터베이스, Edge Functions, 실시간 구독, 스토리지를 활용합니다.

### 주요 기능

- **사용자 관리**: OAuth 인증 (GitHub, Google), 프로필 관리
- **로드맵 CRUD**: 로드맵 생성, 수정, 삭제, Fork
- **게시글 관리**: 마크다운 포스트, 태그, 카테고리
- **소셜 기능**: 팔로우, 좋아요, 댓글, 북마크
- **실시간**: 알림, 채팅
- **분석**: 활동 지표, 통계

## 🛠 기술 스택

| 카테고리 | 기술 |
|---------|------|
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth (OAuth 2.0) |
| API | Supabase Edge Functions (Deno) |
| Realtime | Supabase Realtime |
| Storage | Supabase Storage |
| Security | Row Level Security (RLS) |
| Language | TypeScript, SQL |

## 🏗 아키텍처

### DDD + Hexagonal Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        API Layer                            │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │ Edge Funcs  │ │  Realtime   │ │    REST (PostgREST) │   │
│  └─────────────┘ └─────────────┘ └─────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                    Application Layer                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Business Logic / Use Cases              │   │
│  └─────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                      Domain Layer                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐   │
│  │   User   │ │ Roadmap  │ │   Post   │ │   Activity   │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                   Infrastructure Layer                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │  PostgreSQL │ │   Storage   │ │      External       │   │
│  │  (Supabase) │ │  (Supabase) │ │        APIs         │   │
│  └─────────────┘ └─────────────┘ └─────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## 📁 프로젝트 구조

```
backend/
├── supabase/
│   ├── functions/              # Edge Functions
│   │   ├── roadmap-fork/      # 로드맵 Fork 기능
│   │   ├── activity-score/    # 활동 점수 계산
│   │   ├── notifications/     # 알림 처리
│   │   └── ai-recommend/      # AI 추천 기능
│   ├── migrations/             # 데이터베이스 마이그레이션
│   │   ├── 001_users.sql
│   │   ├── 002_roadmaps.sql
│   │   ├── 003_posts.sql
│   │   ├── 004_social.sql
│   │   └── 005_activities.sql
│   ├── seed/                   # 시드 데이터
│   └── config.toml             # Supabase 설정
├── src/
│   ├── domain/                 # 도메인 모델
│   │   ├── user/
│   │   ├── roadmap/
│   │   ├── post/
│   │   └── activity/
│   ├── application/            # 유스케이스
│   └── infrastructure/         # 외부 서비스 연동
├── tests/                      # 테스트
└── package.json
```

## 🗄 데이터베이스 스키마

### 주요 테이블

```sql
-- 사용자
users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ
)

-- 로드맵
roadmaps (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users,
  title TEXT,
  description TEXT,
  category TEXT,
  nodes JSONB,          -- 노드 구조
  edges JSONB,          -- 연결 정보
  is_public BOOLEAN,
  fork_count INT,
  star_count INT,
  created_at TIMESTAMPTZ
)

-- 게시글
posts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users,
  title TEXT,
  content TEXT,
  excerpt TEXT,
  tags TEXT[],
  roadmap_id UUID REFERENCES roadmaps,
  node_id TEXT,
  like_count INT,
  comment_count INT,
  created_at TIMESTAMPTZ
)

-- 활동
activities (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users,
  activity_type TEXT,   -- post, roadmap, comment, like, chat
  target_id UUID,
  score INT,
  created_at TIMESTAMPTZ
)
```

### ERD

```
┌──────────┐       ┌───────────┐       ┌──────────┐
│  users   │───┬───│  roadmaps │───────│  nodes   │
└──────────┘   │   └───────────┘       └──────────┘
               │          │
               │   ┌──────┴──────┐
               │   │             │
          ┌────┴───┴──┐    ┌─────┴─────┐
          │   posts   │    │  stars    │
          └───────────┘    └───────────┘
               │
          ┌────┴────┐
          │         │
     ┌────┴───┐ ┌───┴────┐
     │comments│ │ likes  │
     └────────┘ └────────┘
```

## 🚀 시작하기

### 사전 요구사항

- [Supabase CLI](https://supabase.com/docs/guides/cli)
- Node.js 18.17+
- Docker (로컬 개발용)

### 설치

```bash
# 저장소 클론
git clone https://github.com/jiwon11/devigation-backend.git
cd devigation-backend

# Supabase CLI 설치
npm install -g supabase

# Supabase 프로젝트 초기화
supabase init

# 로컬 Supabase 시작
supabase start
```

### 환경 변수

```env
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key

# External Services (Optional)
OPENAI_API_KEY=your_openai_key
```

### 마이그레이션 실행

```bash
# 마이그레이션 적용
supabase db push

# 시드 데이터 적용
supabase db seed
```

### Edge Functions 배포

```bash
# 개별 함수 배포
supabase functions deploy roadmap-fork

# 모든 함수 배포
supabase functions deploy
```

## 📜 API 엔드포인트

### REST API (PostgREST)

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/rest/v1/roadmaps` | 로드맵 목록 조회 |
| GET | `/rest/v1/roadmaps?id=eq.{id}` | 로드맵 상세 조회 |
| POST | `/rest/v1/roadmaps` | 로드맵 생성 |
| PATCH | `/rest/v1/roadmaps?id=eq.{id}` | 로드맵 수정 |
| DELETE | `/rest/v1/roadmaps?id=eq.{id}` | 로드맵 삭제 |

### Edge Functions

| Function | 설명 |
|----------|------|
| `POST /functions/v1/roadmap-fork` | 로드맵 Fork |
| `POST /functions/v1/activity-score` | 활동 점수 계산 |
| `POST /functions/v1/ai-recommend` | AI 추천 |

### Realtime Channels

```typescript
// 알림 구독
supabase.channel('notifications')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'notifications',
    filter: `user_id=eq.${userId}`
  }, handleNotification)
  .subscribe()
```

## 🔐 보안

### Row Level Security (RLS)

```sql
-- 로드맵 RLS 정책 예시
CREATE POLICY "Public roadmaps are viewable by everyone"
ON roadmaps FOR SELECT
USING (is_public = true);

CREATE POLICY "Users can CRUD their own roadmaps"
ON roadmaps FOR ALL
USING (auth.uid() = user_id);
```

### 인증 흐름

```
1. 클라이언트 → Supabase Auth (OAuth)
2. Supabase Auth → Provider (GitHub/Google)
3. Provider → 인증 완료
4. Supabase Auth → JWT 토큰 발급
5. 클라이언트 → API 요청 (JWT 포함)
6. RLS → 권한 검증 → 데이터 반환
```

## 📊 활동 점수 계산

```typescript
// 활동 점수 가중치
const ACTIVITY_WEIGHTS = {
  post: 100,      // 게시글 작성
  roadmap: 300,   // 로드맵 생성
  comment: 10,    // 댓글 작성
  like: 1,        // 좋아요 받음
  chat: 1,        // 채팅 메시지
};

// 총 점수 계산
const totalScore = activities.reduce((sum, activity) => {
  return sum + (activity.count * ACTIVITY_WEIGHTS[activity.type]);
}, 0);
```

## 🧪 테스트

```bash
# 단위 테스트
pnpm test

# Edge Functions 테스트
supabase functions serve --debug
curl -X POST http://localhost:54321/functions/v1/roadmap-fork
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
