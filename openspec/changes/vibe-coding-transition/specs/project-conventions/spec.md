## ADDED Requirements

### Requirement: CLAUDE.md 프로젝트 컨벤션 문서
프로젝트 루트에 CLAUDE.md 파일이 존재하여 AI 에이전트가 프로젝트 컨텍스트를 즉시 파악할 수 있어야 한다. 문서에는 기술 스택, 디렉토리 구조, 개발 명령어, 코딩 컨벤션, 환경 설정 방법이 포함되어야 한다(SHALL).

#### Scenario: AI가 프로젝트 컨텍스트를 로드
- **WHEN** Claude Code가 프로젝트를 열 때
- **THEN** CLAUDE.md를 자동으로 읽어 기술 스택, 명령어, 컨벤션을 파악할 수 있어야 한다

#### Scenario: 새 개발자가 프로젝트를 시작
- **WHEN** 개발자가 CLAUDE.md를 읽을 때
- **THEN** 환경 설정부터 개발 서버 실행까지 필요한 모든 정보를 얻을 수 있어야 한다

### Requirement: Conventional Commits 커밋 메시지 규칙
모든 커밋 메시지는 Conventional Commits 형식(`feat:`, `fix:`, `test:`, `chore:`, `docs:`)을 따라야 한다(MUST).

#### Scenario: 기능 추가 커밋
- **WHEN** 새로운 기능을 커밋할 때
- **THEN** 커밋 메시지가 `feat: <설명>` 형식이어야 한다

#### Scenario: 잘못된 형식의 커밋 시도
- **WHEN** Conventional Commits 형식이 아닌 메시지로 커밋 시도 시
- **THEN** CLAUDE.md의 컨벤션 가이드에 따라 올바른 형식으로 수정해야 한다

### Requirement: 브랜치 전략
`main` 브랜치는 production 브랜치이며, 모든 작업은 `feature/*`, `fix/*`, `chore/*` 브랜치에서 진행한 후 PR을 통해 머지해야 한다(SHALL).

#### Scenario: 새 기능 개발 시작
- **WHEN** 새 기능 개발을 시작할 때
- **THEN** `feature/<이름>` 브랜치를 생성하여 작업해야 한다

#### Scenario: main 브랜치 직접 push 방지
- **WHEN** main 브랜치에 직접 push를 시도할 때
- **THEN** PR을 통한 머지만 허용되어야 한다

### Requirement: OpenSpec 워크플로우 설정
openspec/config.yaml에 프로젝트 컨텍스트(기술 스택, 아키텍처)가 설정되어 spec-driven 개발 사이클이 동작해야 한다(MUST).

#### Scenario: OpenSpec으로 새 변경사항 제안
- **WHEN** `/opsx:propose`를 실행할 때
- **THEN** config.yaml의 컨텍스트를 반영한 proposal이 생성되어야 한다
