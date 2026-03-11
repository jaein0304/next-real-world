# Vibe Coding 전환 계획서

> **프로젝트**: next-real-world (Next.js RealWorld App)
> **목적**: 학습용 프로젝트를 AI 협업 기반 바이브 코딩 환경으로 전환
> **작성일**: 2026-03-11
> **작업 형태**: 솔로 개발 + AI 페어 프로그래밍

---

## 1. 현황 분석

### 1.1 기술 스택 (현재 → 목표)

| 항목 | 현재 버전 | 최신 안정 버전 | 비고 |
|------|-----------|---------------|------|
| Next.js | 12.2.0 | 16.1.6 | App Router, RSC, Turbopack |
| React | 18.2.0 | 19.x | Next.js 15+ 필수 |
| TypeScript | 4.7.4 | 5.9 | 6.0 RC 출시됨, 5.9 권장 |
| Prisma | 4.0.0 | 7.4.0 | ESM 전용, 드라이버 어댑터 필수 |
| Apollo Client | 3.6.9 | 4.1.6 | React 분리, 코드모드 제공 |
| Tailwind CSS | 3.1.6 | 4.2.0 | CSS-first 설정, 5x 빌드 성능 |
| ESLint | 8.19.0 | 9.x | Flat config |

### 1.2 현재 부재 항목

| 항목 | 상태 |
|------|------|
| 테스트 파일 | 0개 |
| CI/CD 파이프라인 | 미설정 |
| CLAUDE.md (프로젝트 컨벤션) | 미작성 |
| GitHub Actions 워크플로우 | 미설정 |
| Branch protection | 미설정 |

### 1.3 프로젝트 규모

- 컴포넌트: 58개 파일 (9개 디렉토리)
- 페이지: 11개
- API 스키마: GraphQL Nexus (code-first)
- DB 모델: 7개 (User, Article, Comment, Tag, Favorites, Follows, ArticlesTags)
- GraphQL 스키마 파일: 7개
- 훅: 8개 커스텀 훅

---

## 2. 전환 로드맵

### Phase 1: 개발 문화 기반 구축

**목표**: AI와 효율적으로 협업하기 위한 프로젝트 컨벤션 확립

#### 1-1. CLAUDE.md 생성

프로젝트 루트에 `CLAUDE.md` 파일을 생성하여 다음 내용을 정의:

- **프로젝트 개요**: 기술 스택, 아키텍처 설명
- **코딩 컨벤션**: 네이밍, 파일 구조, import 순서
- **커밋 컨벤션**: Conventional Commits 형식
- **개발 명령어**: build, dev, test, lint 등
- **환경 설정**: 필수 환경변수, DB 설정 방법
- **주요 디렉토리 설명**: 각 폴더의 역할과 책임

#### 1-2. OpenSpec 워크플로우 활성화

이미 설정된 OpenSpec 구조를 활용:

```
openspec/
├── config.yaml          # 설정 보강
├── specs/               # 기능 명세서 관리
└── changes/             # 변경사항 추적
```

- `config.yaml`에 프로젝트 컨텍스트 및 규칙 추가
- spec-driven 개발 사이클 정립: explore → propose → apply → archive

#### 1-3. Git 워크플로우 정립

- **브랜치 전략**: `main` (production) ← `feature/*`, `fix/*`, `chore/*`
- **커밋 메시지**: Conventional Commits (`feat:`, `fix:`, `test:`, `chore:`, `docs:`)
- **PR 템플릿**: Summary, Test Plan 섹션 포함

---

### Phase 2: 테스트 인프라 구축

**목표**: 코드 품질 보장을 위한 자동화된 테스트 환경 구성

#### 2-1. Unit / Integration 테스트 (Vitest)

**선택 근거**: Jest 대비 빠른 실행 속도, ESM 네이티브 지원, Vite 생태계 통합

**설치 패키지**:
```
vitest
@vitejs/plugin-react
jsdom
@testing-library/react
@testing-library/dom
@testing-library/jest-dom
@testing-library/user-event
vite-tsconfig-paths
```

**설정 파일**: `vitest.config.ts`
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: ['node_modules/', 'generated/', '.next/']
    }
  }
})
```

**테스트 디렉토리 구조**:
```
tests/
├── setup.ts                  # 글로벌 설정 (jest-dom matchers 등)
├── unit/
│   ├── lib/
│   │   ├── utils/            # 유틸리티 함수 테스트
│   │   └── hooks/            # 커스텀 훅 테스트
│   └── components/           # 컴포넌트 단위 테스트
├── integration/
│   └── api/                  # GraphQL resolver 테스트
└── mocks/
    ├── prisma.ts             # Prisma 클라이언트 모킹
    └── apollo.ts             # Apollo Client 모킹
```

**테스트 DB**: SQLite 사용
- 테스트 환경에서는 MySQL 대신 SQLite를 사용하여 외부 DB 서버 의존성 제거
- `DATABASE_URL=file:./test.db`로 설정
- Prisma 스키마에서 `provider = "sqlite"` 전환 (테스트용 별도 스키마 또는 환경변수 분기)
- CI 환경에서도 별도 DB 서버 설치 불필요 → 빠른 파이프라인

**적용 전략**: 새 코드부터 적용 (기존 코드는 점진적으로 추가)

**우선 테스트 대상**:
| 대상 | 예시 | 이유 |
|------|------|------|
| 유틸 함수 | markdown parser, date formatter | 순수 함수, 테스트 용이 |
| 커스텀 훅 | useToken, useCurrentUser | 핵심 상태 로직 |
| API resolvers | auth mutations, article queries | 데이터 정합성 |
| 폼 컴포넌트 | LoginForm, EditorForm | 사용자 입력 검증 |

#### 2-2. E2E 테스트 (Playwright)

**선택 근거**: 업계 표준, 크로스 브라우저 지원, 자동 대기(auto-wait), 우수한 DX

**설치 패키지**:
```
@playwright/test
```

**설정 파일**: `playwright.config.ts`
```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['github']],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'yarn dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

**E2E 테스트 구조**:
```
e2e/
├── fixtures/                 # 테스트 데이터 및 헬퍼
├── auth.spec.ts              # 로그인/회원가입 플로우
├── article.spec.ts           # 글 작성/수정/삭제
├── comment.spec.ts           # 댓글 CRUD
├── profile.spec.ts           # 프로필 조회/팔로우
└── navigation.spec.ts        # 페이지 네비게이션
```

#### 2-3. NPM 스크립트 추가

```json
{
  "test": "vitest",
  "test:run": "vitest run",
  "test:coverage": "vitest run --coverage",
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui"
}
```

---

### Phase 3: CI/CD 파이프라인 구축

**목표**: 코드 푸시 시 자동으로 품질 검증 및 배포

#### 3-1. GitHub Actions 워크플로우

**파일**: `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'yarn'

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Lint
        run: yarn lint

      - name: Type check
        run: npx tsc --noEmit

      - name: Unit & Integration tests
        run: yarn test:run --coverage
        env:
          DATABASE_URL: file:./test.db

      - name: Build
        run: yarn build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          PRIVATE_JWK: ${{ secrets.PRIVATE_JWK }}

  e2e:
    runs-on: ubuntu-latest
    needs: quality
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'yarn'

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: Run E2E tests
        run: yarn test:e2e
        env:
          DATABASE_URL: file:./test.db
          PRIVATE_JWK: ${{ secrets.PRIVATE_JWK }}

      - name: Upload test results
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
```

**파이프라인 흐름**:
```
Push/PR → Lint → Type Check → Unit Test → Build → E2E Test → (Vercel 자동 배포)
```

#### 3-2. Vercel 배포 연동

- Vercel은 GitHub 연동 시 push/PR에 자동 배포 (별도 Actions 불필요)
- CI에서 품질 게이트 통과 후 Vercel이 자동 배포 수행
- Production 배포: `main` 브랜치 push 시 자동

#### 3-3. GitHub 설정 (수동 진행 필요)

| 설정 | 위치 | 내용 |
|------|------|------|
| Secrets | Settings → Secrets → Actions | `DATABASE_URL` (production MySQL), `PRIVATE_JWK` 등록. 테스트는 SQLite 사용으로 DB secret 불필요 |
| Branch protection | Settings → Branches | `main` 브랜치: PR 필수, CI 통과 필수 |
| Vercel 연동 | Vercel Dashboard | GitHub 리포지토리 연결 |

---

### Phase 4: Next.js 마이그레이션 (14 → 15)

**목표**: 현대적 Next.js 기능 활용 (App Router, RSC, Turbopack)

> **주의**: 이 단계는 Phase 2-3이 완료되어 테스트/CI가 안전망으로 작동한 후 진행

#### 4-1. 점진적 마이그레이션 전략

Next.js 12 → 최신으로의 직접 마이그레이션은 위험. 단계적 접근:

```
Step 1: Next.js 12 → 14 (Pages Router 유지, 호환성 확보)
Step 2: Next.js 14 → 15 (Async API 적용, 캐싱 변경 대응)
Step 3: Pages Router → App Router (점진적 라우트 이전)
Step 4: Next.js 15 → 16 (안정화 후 최종 업그레이드)
```

#### 4-2. Step 1: Next.js 14 마이그레이션

**주요 변경점**:
- `next/image` 컴포넌트 API 변경
- `next/link` 더 이상 `<a>` 태그 불필요
- `next/font` 도입
- 코드모드 사용: `npx @next/codemod upgrade`

**함께 업그레이드**:
| 패키지 | 현재 | 목표 |
|--------|------|------|
| react | 18.2.0 | 18.3.x (14 호환) |
| typescript | 4.7.4 | 5.9 |
| eslint | 8.19.0 | 9.x |
| tailwindcss | 3.1.6 | 3.4.x (v4는 별도 단계) |

#### 4-3. Step 2: Next.js 15 마이그레이션

**주요 변경점**:
- React 19 필수
- `params`, `searchParams` 등이 async (Promise)
- `fetch` 캐싱 기본값 변경 (no-cache)
- Turbopack 안정화

#### 4-4. Step 3: App Router 전환

**이전 순서** (의존성 낮은 것부터):
1. `pages/404.tsx` → `app/not-found.tsx`
2. `pages/login.tsx` → `app/login/page.tsx`
3. `pages/register.tsx` → `app/register/page.tsx`
4. `pages/settings.tsx` → `app/settings/page.tsx`
5. `pages/profile/[username].tsx` → `app/profile/[username]/page.tsx`
6. `pages/article/[slug].tsx` → `app/article/[slug]/page.tsx`
7. `pages/editor/` → `app/editor/`
8. `pages/index.tsx` → `app/page.tsx` (가장 복잡, 마지막)
9. `pages/_app.tsx` → `app/layout.tsx`

**추가 고려사항**:
- Apollo Client + RSC 호환 전략 결정 필요
- GraphQL API 라우트: `pages/api/index.ts` → `app/api/route.ts`

#### 4-5. 기타 의존성 업그레이드

| 패키지 | 현재 | 목표 | 마이그레이션 노트 |
|--------|------|------|-------------------|
| Prisma | 4.0 | 7.4 | ESM 전용, 드라이버 어댑터 필수, `prisma.config.ts` 신규 |
| Apollo Client | 3.6 | 4.1 | React 분리, 코드모드 제공 |
| Tailwind CSS | 3.1 | 4.2 | CSS-first 설정, `@theme` 디렉티브 (별도 단계 권장) |

---

## 3. 바이브 코딩 워크플로우

전환 완료 후의 일상 개발 사이클:

```
1. /opsx:explore    → 아이디어 탐색, 요구사항 정리
2. /opsx:propose    → 변경사항 제안 (설계 + 스펙 + 태스크)
3. /opsx:apply      → 구현 (AI 페어 프로그래밍)
4. /review          → 코드 리뷰 (자동)
5. /e2e             → E2E 테스트 작성/실행
6. /commit          → 커밋 생성
7. gh pr create     → PR 생성 → CI 자동 실행
8. /opsx:archive    → 변경사항 아카이브
```

---

## 4. 예상 작업량

| Phase | 예상 항목 수 | 복잡도 |
|-------|-------------|--------|
| Phase 1: 문화 기반 | 3개 파일 생성/수정 | 낮음 |
| Phase 2: 테스트 인프라 | 설정 3개 + 샘플 테스트 5~8개 | 중간 |
| Phase 3: CI/CD | 워크플로우 1개 + GitHub 설정 | 낮음 |
| Phase 4: 마이그레이션 | 전체 코드베이스 영향 | 높음 |

---

## 5. 위험 요소 및 대응

| 위험 | 영향도 | 대응 |
|------|--------|------|
| Next.js 12→15 호환성 깨짐 | 높음 | 단계적 마이그레이션, 각 단계 테스트 확인 |
| Prisma 4→7 스키마 변경 | 중간 | 코드모드 활용, DB 백업 후 진행 |
| Apollo Client v3→v4 breaking change | 중간 | 공식 코드모드 실행, 점진적 적용 |
| Tailwind v3→v4 클래스명 변경 | 중간 | 자동 마이그레이션 도구 사용 |
| E2E 테스트 환경에서 DB 의존성 | 중간 | 테스트용 SQLite DB 사용으로 외부 의존성 제거 |

---

## 6. 참고 자료

- [Next.js 마이그레이션 가이드](https://nextjs.org/docs/app/guides/upgrading)
- [Vitest 공식 문서](https://vitest.dev/)
- [Playwright 공식 문서](https://playwright.dev/)
- [Prisma v7 업그레이드 가이드](https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7)
- [Apollo Client 4 마이그레이션](https://www.apollographql.com/docs/react/migrating/apollo-client-4-migration)
- [Tailwind CSS v4 마이그레이션](https://tailwindcss.com/docs/upgrade-guide)
