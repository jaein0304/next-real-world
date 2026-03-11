## ADDED Requirements

### Requirement: GitHub Actions CI 워크플로우
`main` 브랜치에 대한 push 및 PR 시 자동으로 품질 검증 파이프라인이 실행되어야 한다(SHALL).

#### Scenario: PR 생성 시 CI 실행
- **WHEN** `main` 브랜치로 PR을 생성할 때
- **THEN** lint → type-check → unit test → build → e2e test 순서로 파이프라인이 실행되어야 한다

#### Scenario: main 브랜치 push 시 CI 실행
- **WHEN** `main` 브랜치에 push할 때
- **THEN** 동일한 CI 파이프라인이 실행되어야 한다

#### Scenario: 린트 실패 시 후속 단계 중단
- **WHEN** lint 단계에서 오류가 발생할 때
- **THEN** type-check, test, build 단계는 실행되지 않아야 한다

### Requirement: CI 파이프라인 단계 구성
파이프라인은 quality(lint, type-check, unit test, build)와 e2e 두 job으로 구성되어야 한다(MUST).

#### Scenario: quality job 구성
- **WHEN** CI가 실행될 때
- **THEN** 단일 job에서 lint, type-check(`tsc --noEmit`), unit test(`vitest run`), build(`next build`)가 순차 실행되어야 한다

#### Scenario: e2e job은 quality 통과 후 실행
- **WHEN** quality job이 성공할 때
- **THEN** e2e job이 시작되어 Playwright 테스트를 실행해야 한다

#### Scenario: quality job 실패 시 e2e 스킵
- **WHEN** quality job이 실패할 때
- **THEN** e2e job은 실행되지 않아야 한다

### Requirement: CI 환경 설정
CI에서 Node.js 20, Yarn, 의존성 캐싱이 설정되어야 한다(SHALL).

#### Scenario: 의존성 캐싱으로 빌드 시간 단축
- **WHEN** 이전 CI 실행과 동일한 yarn.lock이 있을 때
- **THEN** 캐시된 node_modules를 사용하여 install 시간을 단축해야 한다

#### Scenario: 테스트에서 SQLite DB 사용
- **WHEN** unit test 및 e2e test가 CI에서 실행될 때
- **THEN** `DATABASE_URL=file:./test.db`로 SQLite를 사용하여 외부 DB 없이 실행되어야 한다

### Requirement: Vercel 배포 연동
Vercel의 GitHub 연동을 통해 main 브랜치 push 시 production 배포가 자동으로 이루어져야 한다(SHALL).

#### Scenario: CI 통과 후 자동 배포
- **WHEN** main 브랜치에 push되고 CI가 통과할 때
- **THEN** Vercel이 자동으로 production 배포를 수행해야 한다

#### Scenario: PR에 대한 프리뷰 배포
- **WHEN** PR이 생성될 때
- **THEN** Vercel이 프리뷰 URL을 생성하여 PR에 코멘트해야 한다

### Requirement: 테스트 실패 리포트
E2E 테스트 실패 시 디버깅을 위한 아티팩트가 업로드되어야 한다(SHALL).

#### Scenario: E2E 실패 시 Playwright 리포트 업로드
- **WHEN** e2e job에서 Playwright 테스트가 실패할 때
- **THEN** `playwright-report/` 디렉토리가 GitHub Actions artifact로 업로드되어야 한다
