---
name: Test
description: 컨텍스트에 맞는 테스트를 자동 판단하여 실행
category: Development
tags: [test, vitest, playwright]
---

변경된 코드의 성격에 따라 적절한 테스트를 자동 판단하여 실행한다.

**Input**: 선택적으로 테스트 유형 지정 가능 (`/test unit`, `/test integration`, `/test e2e`, `/test all`)

## 동작 방식

### 인자가 없을 때 — 스마트 판단

1. `git diff --name-only`로 변경된 파일 목록 확인
2. 변경 유형에 따라 테스트 범위 결정:
   - `lib/utils/`, `lib/hooks/` 변경 → unit test
   - `lib/api/`, `prisma/` 변경 → integration test
   - `components/`, `app/`, `pages/` 변경 → unit test + 관련 컴포넌트 테스트
   - 여러 영역 변경 → unit + integration 모두 실행
3. 변경된 파일과 관련된 테스트 파일을 `tests/` 에서 탐색

### 인자가 있을 때

- `unit` → `npx vitest run --testPathPattern='tests/unit'`
- `integration` → `npx vitest run --testPathPattern='tests/integration'`
- `e2e` → `npx playwright test`
- `all` → unit + integration + e2e 순차 실행

## 테스트 실행 전 준비

- **Integration test 실행 시**: SQLite 테스트 DB가 준비되었는지 확인
  ```bash
  npx prisma db push --schema=prisma/schema.test.prisma --force-reset
  ```
- **E2E test 실행 시**: Playwright 브라우저 설치 여부 확인
  ```bash
  npx playwright install chromium --with-deps
  ```

## 출력 형식

```
## Test Results

**범위**: unit (자동 판단 — lib/utils/ 변경 감지)
**실행**: npx vitest run --testPathPattern='tests/unit'

✓ 12 tests passed (3 files)
Duration: 0.8s
```

실패 시:
```
## Test Results

**범위**: integration
**실행**: npx vitest run --testPathPattern='tests/integration'

✗ 1 test failed, 3 passed

### Failed Tests
- tests/integration/api/user.test.ts > "should create user"
  Error: Expected status 200, received 500

### 분석
<실패 원인 분석 및 수정 제안>
```

## 가드레일
- 테스트 실패 시 자동 수정하지 않음 — 원인 분석과 수정 방안만 제시
- E2E는 시간이 오래 걸리므로 명시적으로 요청한 경우에만 실행
- `--watch` 모드는 사용하지 않음 (CI 호환성)
