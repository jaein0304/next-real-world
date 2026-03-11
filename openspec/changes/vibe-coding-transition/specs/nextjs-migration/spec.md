## ADDED Requirements

### Requirement: Next.js 14 마이그레이션
Next.js 12.2에서 14.x로 업그레이드하여 최신 Pages Router 기능을 사용할 수 있어야 한다(SHALL).

#### Scenario: Next.js 14로 빌드 성공
- **WHEN** Next.js 14로 업그레이드한 후 `yarn build`를 실행할 때
- **THEN** 빌드가 에러 없이 완료되어야 한다

#### Scenario: 코드모드 자동 변환
- **WHEN** `npx @next/codemod upgrade` 실행 시
- **THEN** next/image, next/link 등 deprecated API가 자동 변환되어야 한다

#### Scenario: 기존 페이지 정상 동작
- **WHEN** 업그레이드 후 모든 페이지를 탐색할 때
- **THEN** 기존 기능(인증, 글 작성, 댓글 등)이 동일하게 동작해야 한다

### Requirement: Next.js 15 마이그레이션
Next.js 14에서 15로 업그레이드하여 React 19 및 async API를 사용할 수 있어야 한다(SHALL).

#### Scenario: React 19 호환
- **WHEN** Next.js 15로 업그레이드할 때
- **THEN** React 19가 설치되고 기존 컴포넌트가 정상 동작해야 한다

#### Scenario: Async API 적용
- **WHEN** `params`, `searchParams`를 사용하는 페이지가 있을 때
- **THEN** async/await 패턴으로 변환되어야 한다

### Requirement: App Router 점진적 전환
Pages Router에서 App Router로 페이지를 점진적으로 전환할 수 있어야 한다(SHALL). 두 라우터가 공존하는 상태에서도 앱이 정상 동작해야 한다(MUST).

#### Scenario: 단일 페이지 App Router 전환
- **WHEN** 하나의 페이지를 `pages/` → `app/` 으로 이전할 때
- **THEN** 나머지 Pages Router 페이지와 함께 앱이 정상 동작해야 한다

#### Scenario: Layout 공유
- **WHEN** App Router로 전환 시
- **THEN** `app/layout.tsx`에서 공통 레이아웃(Header, Footer, Providers)이 제공되어야 한다

#### Scenario: 전환 순서
- **WHEN** App Router 전환을 진행할 때
- **THEN** 의존성 낮은 페이지(404, login, register)부터 시작하여 복잡한 페이지(index)를 마지막에 전환해야 한다

### Requirement: 의존성 현대화
주요 의존성을 최신 안정 버전으로 업그레이드해야 한다(SHALL).

#### Scenario: TypeScript 5.9 업그레이드
- **WHEN** TypeScript를 5.9로 업그레이드할 때
- **THEN** `tsc --noEmit`으로 타입 검사가 에러 없이 통과해야 한다

#### Scenario: Prisma 7 업그레이드
- **WHEN** Prisma를 7.x로 업그레이드할 때
- **THEN** ESM 모듈, 드라이버 어댑터 설정이 적용되고 기존 스키마 마이그레이션이 동작해야 한다

#### Scenario: Apollo Client 4 업그레이드
- **WHEN** Apollo Client를 4.x로 업그레이드할 때
- **THEN** 공식 코드모드 실행 후 GraphQL 쿼리/뮤테이션이 정상 동작해야 한다

#### Scenario: Tailwind CSS 4 업그레이드
- **WHEN** Tailwind CSS를 4.x로 업그레이드할 때
- **THEN** 자동 마이그레이션 도구로 클래스명이 변환되고 UI가 동일하게 렌더링되어야 한다

### Requirement: 마이그레이션 안전성
각 마이그레이션 단계는 독립 브랜치에서 진행되어야 하며, 테스트 통과 후에만 머지해야 한다(MUST).

#### Scenario: 마이그레이션 단계별 검증
- **WHEN** 각 마이그레이션 단계(Next.js 14, 15, App Router, 의존성)를 완료할 때
- **THEN** 전체 테스트 스위트(unit + e2e)가 통과해야 머지 가능

#### Scenario: 마이그레이션 실패 시 롤백
- **WHEN** 마이그레이션 브랜치에서 해결 불가능한 문제가 발생할 때
- **THEN** 브랜치를 폐기하고 main에 영향 없이 원상복구할 수 있어야 한다
