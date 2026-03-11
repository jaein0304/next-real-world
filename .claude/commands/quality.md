---
name: Quality Check
description: CI 파이프라인을 로컬에서 실행하여 push 전 품질 검증
category: Workflow
tags: [ci, lint, test, build]
---

GitHub Actions CI와 동일한 품질 검증 파이프라인을 로컬에서 순차 실행한다.
하나라도 실패하면 즉시 중단하고 원인을 분석한다.

## 실행 순서

1. **Lint** — `yarn lint` 실행
2. **Type Check** — `npx tsc --noEmit` 실행
3. **Unit/Integration Test** — `npx vitest run` 실행
4. **Build** — `yarn build` 실행

## 각 단계별 처리

- 각 단계 시작 시 `## Step N: <단계명>` 출력
- 성공 시 `✓ <단계명> passed` 출력 후 다음 단계 진행
- 실패 시 즉시 중단하고 에러 내용을 분석하여 수정 방안 제시
- 수정이 간단하면 (예: lint auto-fix) 자동 수정 후 재실행 제안

## 출력 형식

```
## Quality Check

Step 1/4: Lint .............. ✓
Step 2/4: Type Check ........ ✓
Step 3/4: Unit Test ......... ✓ (24 tests passed)
Step 4/4: Build ............. ✓

All checks passed! Ready to push.
```

실패 시:
```
## Quality Check

Step 1/4: Lint .............. ✓
Step 2/4: Type Check ........ ✗

### Type Check Failed
<에러 내용 요약>

### 수정 방안
<구체적 수정 제안>
```

## 가드레일
- `yarn lint`에서 warning만 있으면 통과로 처리
- 빌드 시 `eslint.ignoreDuringBuilds: true` 설정이 있으므로 lint는 별도 단계에서만 검증
- 테스트 실패 시 실패한 테스트 목록과 에러 메시지를 명확히 표시
