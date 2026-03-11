## Context

Next.js 12 + React 18 + Prisma 4 + Apollo Client 3 기반 RealWorld 앱. 테스트 0개, CI/CD 미설정, CLAUDE.md 미작성. 솔로 개발자가 AI 페어 프로그래밍으로 학습 목적으로 운영 중. 배포는 Vercel(production) + AWS Serverless(대체) 이중 구성.

**현재 구조:**
```
pages/          → 11개 페이지 (Pages Router)
components/     → 58개 컴포넌트 파일
lib/            → 38개 (API resolvers, hooks, utils, auth, cache, schemas)
prisma/         → MySQL 스키마 (7 모델)
generated/      → GraphQL 코드젠 타입
```

## Goals / Non-Goals

**Goals:**
- 테스트 없이 코드 변경 시 회귀 발생 위험을 자동화된 테스트로 제거
- push/PR 시 자동 품질 검증(lint, type-check, test, build)으로 깨진 코드 배포 방지
- CLAUDE.md로 AI가 프로젝트 컨텍스트를 즉시 파악하도록 하여 바이브 코딩 효율 극대화
- 현대적 Next.js 기능(App Router, RSC, Turbopack) 활용 가능한 상태로 업그레이드
- 테스트 환경에서 외부 DB 의존성 제거 (SQLite 사용)

**Non-Goals:**
- 100% 테스트 커버리지 (새 코드부터 적용, 기존 코드는 점진적)
- 마이크로서비스 전환이나 아키텍처 재설계
- Production DB를 MySQL에서 변경
- 모바일 앱 또는 네이티브 지원

## Decisions

### 1. 테스트 프레임워크: Vitest + Playwright

**선택**: Vitest (Unit/Integration) + Playwright (E2E)
**대안 검토**:
- Jest: 성숙하지만 ESM 지원 미흡, 설정 복잡, Vitest 대비 느림
- Cypress: 브라우저 기반 E2E지만, Playwright 대비 크로스 브라우저 지원 약함

**근거**: Vitest는 Vite 네이티브로 빠른 HMR 테스트, ESM 기본 지원. Playwright는 auto-wait, 크로스 브라우저, codegen 지원으로 업계 표준화.

### 2. 테스트 DB: SQLite

**선택**: 테스트 환경에서 SQLite 사용 (`file:./test.db`)
**대안 검토**:
- Docker MySQL: 실환경 동일하지만 CI 속도 저하, 로컬 Docker 의존
- In-memory mock: 빠르지만 실제 쿼리 검증 불가

**근거**: Prisma가 SQLite를 지원하므로 스키마 동일하게 유지하면서 외부 의존성 제거. CI에서 DB 서버 설치 불필요.

### 3. CI/CD: GitHub Actions + Vercel

**선택**: GitHub Actions(품질 게이트) + Vercel(배포)
**대안 검토**:
- GitHub Actions만으로 빌드+배포: Vercel 이미 설정되어 있어 중복
- CircleCI/Travis: GitHub 네이티브가 아니라 설정 복잡

**근거**: Vercel은 Next.js 최적 배포 플랫폼으로 push 시 자동 배포. GitHub Actions는 테스트/린트 게이트만 담당하여 역할 분리.

### 4. 마이그레이션 전략: 단계적 업그레이드

**선택**: Next.js 12 → 14 → 15 → App Router 순서
**대안 검토**:
- 한 번에 최신 버전: breaking change 누적으로 디버깅 불가능
- 처음부터 App Router 재작성: 기존 코드 활용 불가

**근거**: 각 메이저 버전마다 코드모드 제공. 단계별 테스트 확인으로 안전한 마이그레이션. Pages Router는 최신 Next.js에서도 지원되므로 점진적 전환 가능.

### 5. Phase 순서: 컨벤션 → 테스트 → CI/CD → 마이그레이션

**근거**:
```
Phase 1 (컨벤션)  → AI 협업 효율을 먼저 확보
Phase 2 (테스트)  → 안전망 구축
Phase 3 (CI/CD)  → 자동화
Phase 4 (마이그레이션) → 테스트+CI 위에서 안전하게 진행
```

마이그레이션을 마지막에 두는 이유: 테스트와 CI가 없으면 업그레이드 중 회귀를 감지할 수 없음.

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| Prisma SQLite와 MySQL 간 SQL 방언 차이로 테스트 결과 불일치 | Prisma ORM이 추상화하므로 대부분 호환. raw query 사용 시 별도 검증 |
| Next.js 12→15 마이그레이션 중 Apollo Server micro 호환성 | App Router의 Route Handler로 전환 시 Apollo Server 설정 변경 필요. 단계적 진행으로 격리 |
| Apollo Client v3→v4 breaking change로 캐시 로직 깨짐 | 공식 코드모드 실행 후 캐시 정책 수동 검증 |
| Tailwind v3→v4 클래스명 변경으로 UI 깨짐 | 자동 마이그레이션 도구 사용 + E2E 스크린샷 비교 |
| Prisma 4→7 ESM 전용 전환으로 기존 CJS 코드 호환 문제 | Next.js 15+는 ESM 기본이므로 Next.js 마이그레이션과 동시 진행 |

## Migration Plan

```
Phase 1: CLAUDE.md + Git 워크플로우 → 커밋 후 즉시 적용
Phase 2: Vitest + Playwright 설정 → 샘플 테스트로 검증 후 커밋
Phase 3: GitHub Actions → PR로 파이프라인 동작 확인
Phase 4-1: Next.js 14 + React 18.3 + TS 5.9 → 전체 테스트 통과 확인
Phase 4-2: Next.js 15 + React 19 → 전체 테스트 통과 확인
Phase 4-3: App Router 점진적 전환 → 페이지별 마이그레이션 + 테스트
Phase 4-4: Prisma 7 + Apollo Client 4 + Tailwind 4 → 각각 독립 PR
```

**Rollback**: 각 Phase는 독립 브랜치에서 진행. 실패 시 브랜치 폐기로 main 영향 없음.

## Open Questions

- Apollo Client + React Server Components 조합의 최적 패턴은? (RSC에서는 Apollo 대신 직접 fetch 사용이 권장되는 추세)
- Nexus(code-first GraphQL)가 App Router Route Handler와 호환되는지 검증 필요
- Serverless Framework 배포를 계속 유지할지, Vercel 단일로 전환할지
