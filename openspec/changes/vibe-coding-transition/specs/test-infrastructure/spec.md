## ADDED Requirements

### Requirement: Vitest 단위 테스트 환경
프로젝트에 Vitest가 설정되어 `yarn test` 명령으로 단위 테스트를 실행할 수 있어야 한다(SHALL). jsdom 환경에서 React 컴포넌트와 훅을 테스트할 수 있어야 한다.

#### Scenario: 유틸리티 함수 테스트 실행
- **WHEN** `yarn test` 명령을 실행할 때
- **THEN** `tests/` 디렉토리의 모든 `*.test.ts` 파일이 실행되고 결과가 출력되어야 한다

#### Scenario: React 컴포넌트 테스트
- **WHEN** React 컴포넌트 테스트 파일을 실행할 때
- **THEN** jsdom 환경에서 렌더링되고 @testing-library/react로 DOM 검증이 가능해야 한다

#### Scenario: 테스트 커버리지 리포트
- **WHEN** `yarn test:coverage` 명령을 실행할 때
- **THEN** v8 provider로 커버리지 리포트(text, html, lcov)가 생성되어야 한다

### Requirement: Playwright E2E 테스트 환경
프로젝트에 Playwright가 설정되어 `yarn test:e2e` 명령으로 E2E 테스트를 실행할 수 있어야 한다(SHALL).

#### Scenario: E2E 테스트 실행
- **WHEN** `yarn test:e2e` 명령을 실행할 때
- **THEN** Chromium 브라우저에서 `e2e/` 디렉토리의 모든 `*.spec.ts` 파일이 실행되어야 한다

#### Scenario: 개발 서버 자동 시작
- **WHEN** E2E 테스트가 시작될 때
- **THEN** 로컬 개발 서버(`localhost:3000`)가 자동으로 시작되어야 한다 (이미 실행 중이면 재사용)

#### Scenario: 실패 시 디버깅 지원
- **WHEN** E2E 테스트가 실패할 때
- **THEN** 스크린샷과 trace 파일이 자동 생성되어야 한다

### Requirement: 테스트 DB로 SQLite 사용
테스트 환경에서는 MySQL 대신 SQLite를 사용하여 외부 DB 서버 의존성 없이 테스트를 실행할 수 있어야 한다(MUST).

#### Scenario: 테스트 환경에서 DB 연결
- **WHEN** `DATABASE_URL=file:./test.db`로 설정하고 테스트를 실행할 때
- **THEN** SQLite 파일 기반 DB가 생성되고 Prisma 마이그레이션이 적용되어야 한다

#### Scenario: CI 환경에서 DB 서버 없이 테스트
- **WHEN** GitHub Actions에서 테스트를 실행할 때
- **THEN** 별도 MySQL 서버 설치 없이 SQLite로 테스트가 완료되어야 한다

### Requirement: 샘플 테스트 제공
테스트 인프라 구축 시 각 유형별 샘플 테스트를 포함하여 패턴을 확립해야 한다(SHALL).

#### Scenario: 유틸 함수 샘플 테스트
- **WHEN** 테스트 인프라 설정이 완료되었을 때
- **THEN** lib/utils/ 의 함수에 대한 샘플 단위 테스트가 존재해야 한다

#### Scenario: 커스텀 훅 샘플 테스트
- **WHEN** 테스트 인프라 설정이 완료되었을 때
- **THEN** 커스텀 훅(예: useToken)에 대한 샘플 테스트가 존재해야 한다

#### Scenario: E2E 샘플 테스트
- **WHEN** Playwright 설정이 완료되었을 때
- **THEN** 홈페이지 네비게이션에 대한 샘플 E2E 테스트가 존재해야 한다
