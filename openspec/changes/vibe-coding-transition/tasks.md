## 1. 프로젝트 컨벤션 (Phase 1)

- [x] 1.1 CLAUDE.md 생성 — 기술 스택, 디렉토리 구조, 개발 명령어, 코딩 컨벤션, 환경 설정 문서화
- [x] 1.2 openspec/config.yaml에 프로젝트 컨텍스트(기술 스택, 아키텍처 요약) 추가
- [x] 1.3 .github/PULL_REQUEST_TEMPLATE.md 생성 — Summary, Test Plan 섹션 포함
- [x] 1.4 Conventional Commits 규칙을 CLAUDE.md에 명시하고 예시 포함

## 2. Vitest 테스트 환경 구축 (Phase 2-1)

- [x] 2.1 Vitest 및 관련 패키지 설치 (vitest, @vitejs/plugin-react, jsdom, @testing-library/react, @testing-library/dom, @testing-library/jest-dom, @testing-library/user-event, vite-tsconfig-paths)
- [x] 2.2 vitest.config.ts 생성 — jsdom 환경, react 플러그인, tsconfig paths, v8 커버리지 설정
- [x] 2.3 tests/setup.ts 생성 — @testing-library/jest-dom matchers 글로벌 등록
- [x] 2.4 package.json에 test 스크립트 추가 (test, test:run, test:coverage)
- [x] 2.5 샘플 유틸 함수 테스트 작성 — lib/utils/ 대상 (예: markdown parser, date formatter)
- [x] 2.6 샘플 커스텀 훅 테스트 작성 — renderHook으로 useToken 등 테스트
- [x] 2.7 샘플 컴포넌트 테스트 작성 — @testing-library/react로 간단한 컴포넌트 렌더링 테스트

## 3. 테스트 DB (SQLite) 설정 (Phase 2-2)

- [x] 3.1 테스트용 Prisma 스키마 또는 환경변수 분기 전략 결정 및 구현 (MySQL ↔ SQLite 호환)
- [x] 3.2 테스트 전 SQLite DB 자동 마이그레이션 스크립트 작성 (prisma migrate 또는 db push)
- [x] 3.3 Prisma 클라이언트 모킹 유틸 생성 (tests/mocks/prisma.ts)
- [x] 3.4 SQLite 기반 Integration 테스트 샘플 작성 — API resolver 테스트

## 4. Playwright E2E 테스트 환경 구축 (Phase 2-3)

- [x] 4.1 @playwright/test 패키지 설치 및 Playwright 브라우저(chromium) 설치
- [x] 4.2 playwright.config.ts 생성 — baseURL, webServer, trace, screenshot 설정
- [x] 4.3 package.json에 e2e 스크립트 추가 (test:e2e, test:e2e:ui)
- [x] 4.4 샘플 E2E 테스트 작성 — 홈페이지 로드 및 네비게이션 검증
- [x] 4.5 .gitignore에 test-results/, playwright-report/ 추가

## 5. GitHub Actions CI/CD (Phase 3)

- [x] 5.1 .github/workflows/ci.yml 생성 — quality job (lint, type-check, unit test, build)
- [x] 5.2 ci.yml에 e2e job 추가 — quality 통과 후 Playwright 테스트 실행, 실패 시 리포트 업로드
- [x] 5.3 CI에서 yarn 캐싱 설정 (actions/cache 또는 setup-node cache)
- [x] 5.4 CI 환경변수 설정 — 테스트는 SQLite(DATABASE_URL=file:./test.db), 빌드는 secrets 참조
- [x] 5.5 README 또는 CLAUDE.md에 GitHub Secrets 설정 가이드 추가 (DATABASE_URL, PRIVATE_JWK)

## 6. Next.js 14 마이그레이션 (Phase 4-1)

- [x] 6.1 feature/nextjs-14 브랜치 생성
- [x] 6.2 Next.js 14, React 18.3, TypeScript 5.9로 패키지 업그레이드
- [x] 6.3 npx @next/codemod upgrade 실행 — next/image, next/link 등 자동 변환
- [x] 6.4 ESLint 설정 업데이트 (Next.js 14 호환)
- [x] 6.5 빌드 확인 (yarn build) 및 전체 테스트 실행
- [x] 6.6 수동 스모크 테스트 — 주요 페이지(홈, 로그인, 글 작성, 프로필) 확인
- [x] 6.7 PR 생성 및 CI 통과 확인 후 머지

## 7. Next.js 15 마이그레이션 (Phase 4-2)

- [x] 7.1 feature/nextjs-15 브랜치 생성
- [x] 7.2 Next.js 15, React 19로 패키지 업그레이드
- [x] 7.3 Async API 변환 — Pages Router에서는 불필요 (App Router 전환 시 적용)
- [x] 7.4 fetch 캐싱 기본값 변경 대응 — Pages Router에서는 영향 없음
- [x] 7.5 빌드 확인 및 전체 테스트 실행
- [x] 7.6 PR 생성 및 CI 통과 확인 후 머지

## 8. App Router 전환 (Phase 4-3)

- [x] 8.1 feature/nextjs-14 브랜치에서 작업 (기존 브랜치 재활용)
- [x] 8.2 app/layout.tsx 생성 — 공통 레이아웃 (Header, Footer, Providers, Suspense)
- [x] 8.3 pages/404.tsx → app/not-found.tsx 전환
- [x] 8.4 pages/login.tsx → app/login/page.tsx 전환
- [x] 8.5 pages/register.tsx → app/register/page.tsx 전환
- [x] 8.6 pages/settings.tsx → app/settings/page.tsx 전환
- [x] 8.7 pages/profile/[username].tsx → app/profile/[username]/page.tsx 전환
- [x] 8.8 pages/article/[slug].tsx → app/article/[slug]/page.tsx 전환
- [x] 8.9 pages/editor/ → app/editor/ 전환
- [x] 8.10 pages/index.tsx → app/page.tsx 전환
- [x] 8.11 pages/api/index.ts는 Pages Router에 유지 (Apollo Server micro는 Route Handler 미지원)
- [x] 8.12 pages/_app.tsx 유지 (pages/api 존재로 필요, 하지만 실제 렌더링 없음)
- [x] 8.13 전체 빌드 및 테스트 통과 확인 — next/router → next/navigation 마이그레이션 완료

## 9. 의존성 현대화 (Phase 4-4)

- [x] 9.1 feature/prisma-7 브랜치 — Prisma 7 업그레이드 (ESM, 드라이버 어댑터, prisma.config.ts) → PR #9
- [x] 9.2 feature/apollo-4 브랜치 — Apollo Client 4 업그레이드 (코드모드 실행, 캐시 검증) → PR #10
- [x] 9.3 feature/tailwind-4 브랜치 — Tailwind CSS 4 업그레이드 (자동 마이그레이션 도구, UI 검증) → PR #11
- [x] 9.4 각 브랜치별 전체 테스트 통과 확인 후 순차적 머지 — 빌드 통과, 6/6 테스트 통과
