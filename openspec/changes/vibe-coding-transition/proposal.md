## Why

이 프로젝트는 Next.js 12 기반 RealWorld 앱으로, 테스트·CI/CD·프로젝트 컨벤션이 전무한 상태다. AI 페어 프로그래밍(바이브 코딩) 환경으로 전환하려면 자동화된 품질 게이트와 명확한 컨벤션이 먼저 필요하다. 또한 주요 의존성이 2022년 기준이라 현대적 기능(App Router, RSC, Turbopack)을 활용할 수 없다.

## What Changes

- **CLAUDE.md 생성**: 프로젝트 컨벤션, 명령어, 아키텍처를 문서화하여 AI 협업 기반 확립
- **테스트 인프라 구축**: Vitest(Unit/Integration) + Playwright(E2E) 도입, 테스트 DB로 SQLite 사용
- **CI/CD 파이프라인**: GitHub Actions로 lint → type-check → test → build → E2E 자동화
- **Git 워크플로우 정립**: Conventional Commits, 브랜치 전략, PR 템플릿
- **Next.js 마이그레이션**: 12.2 → 15+ 점진적 업그레이드 (Pages Router → App Router)
- **의존성 현대화**: React 19, TypeScript 5.9, Prisma 7, Apollo Client 4, Tailwind CSS 4
- **OpenSpec 워크플로우 활성화**: config.yaml에 프로젝트 컨텍스트 추가, spec-driven 사이클 정립

## Capabilities

### New Capabilities
- `project-conventions`: CLAUDE.md 및 Git 워크플로우 컨벤션 (커밋 규칙, 브랜치 전략, PR 템플릿)
- `test-infrastructure`: Vitest + Playwright 테스트 환경 구성 및 테스트 DB(SQLite) 설정
- `ci-cd-pipeline`: GitHub Actions 기반 자동화 파이프라인 (lint, type-check, test, build, e2e)
- `nextjs-migration`: Next.js 12 → 15+ 점진적 마이그레이션 및 의존성 현대화

### Modified Capabilities
(기존 specs 없음 — 모두 신규)

## Impact

- **코드 전체**: Next.js 마이그레이션으로 pages/, components/, lib/ 전반 영향
- **패키지**: package.json 주요 의존성 20개+ 버전 업그레이드
- **DB**: 테스트 환경에서 MySQL → SQLite 전환 (Production MySQL 유지)
- **인프라**: GitHub Actions 워크플로우 신규, Vercel 배포 연동
- **DX**: 모든 코드 변경에 자동 품질 검증 적용
