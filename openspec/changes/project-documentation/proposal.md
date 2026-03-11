## Why

프로젝트의 현재 아키텍처, API, 데이터 모델, 컴포넌트 구조가 코드에만 존재하고 별도 명세(spec)로 문서화되어 있지 않다. AI 협업 및 향후 마이그레이션 시 프로젝트 전체 구조를 빠르게 파악할 수 있는 기준 문서가 필요하다. OpenSpec의 specs 디렉토리에 capability 단위로 프로젝트를 문서화하여 spec-driven 워크플로우의 기반을 확립한다.

## What Changes

- **OpenSpec 메인 스펙 생성**: `openspec/specs/` 디렉토리에 프로젝트의 현재 상태를 capability별로 문서화
- **CLAUDE.md 업데이트**: 기존 CLAUDE.md에 OpenSpec 스펙 참조 정보 추가
- **openspec/config.yaml 보강**: 프로젝트 컨텍스트 (기술 스택, 아키텍처 요약) 추가

## Capabilities

### New Capabilities
- `data-model`: Prisma 데이터 모델 — 7개 모델(User, Article, Comment, Tag, Favorites, Follows, ArticlesTags)의 스키마, 관계, 제약조건
- `graphql-api`: GraphQL API 계층 — Nexus code-first 스키마, queries(4), mutations(4 그룹), types, input types, 인증/인가 규칙
- `authentication`: 인증 시스템 — JWT RS256, 토큰 관리, Auth HOC, 세션 플로우
- `frontend-architecture`: 프론트엔드 아키텍처 — Apollo Client, 캐시 정책, 상태 관리, 프로바이더 구성, 커스텀 훅
- `pages-and-routing`: 페이지 및 라우팅 — 11개 페이지, 인증별 접근 제어, SSR 전략
- `components`: 컴포넌트 구조 — 58개 파일, 7개 도메인 디렉토리, 폼 시스템, 공통 UI
- `validation`: 유효성 검증 — Yup 스키마, 클라이언트-서버 공유 검증, React Hook Form 통합
- `dev-tooling`: 개발 도구 및 설정 — TypeScript, ESLint, Prettier, Tailwind, 코드 생성, 빌드/배포 구성

### Modified Capabilities
(기존 specs 없음 — 모두 신규)

## Impact

- **openspec/specs/**: 8개 capability 디렉토리 및 spec.md 파일 생성
- **openspec/config.yaml**: 프로젝트 컨텍스트 추가
- **CLAUDE.md**: OpenSpec 스펙 참조 섹션 추가
- 기존 코드 변경 없음 — 문서화만 진행
