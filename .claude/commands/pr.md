---
name: PR
description: 프로젝트 컨벤션에 맞는 PR 생성 (브랜치 전략 + Conventional Commits)
category: Workflow
tags: [git, pr, github]
---

프로젝트 컨벤션에 따라 PR을 생성한다.

**Input**: 선택적으로 PR 제목이나 설명 힌트 제공 가능

## 사전 검증

1. **현재 브랜치 확인**
   - `main` 브랜치에서 직접 작업 중이면 경고하고, `feature/*` 또는 `fix/*` 또는 `chore/*` 브랜치 생성 제안
   - 브랜치명이 컨벤션(`feature/`, `fix/`, `chore/`)을 따르지 않으면 경고

2. **변경 사항 확인**
   - `git status`로 커밋되지 않은 변경 확인 → 있으면 커밋 먼저 제안
   - `git log main..HEAD`로 포함될 커밋 목록 확인
   - `git diff main...HEAD`로 전체 변경 사항 파악

3. **품질 검증**
   - `/quality` 스킬과 동일한 검증을 실행할지 사용자에게 확인
   - 이미 CI가 통과한 상태라면 스킵 가능

## PR 생성

1. **PR 제목 작성** — Conventional Commits 형식
   - 커밋 히스토리를 분석하여 적절한 prefix 결정 (`feat:`, `fix:`, `chore:`, `test:`, `docs:`)
   - 70자 이내로 간결하게

2. **PR 본문 작성** — 프로젝트 PR 템플릿 준수
   ```markdown
   ## Summary
   <1-3개 bullet points>

   ## Test plan
   - [ ] 테스트 체크리스트...

   Generated with [Claude Code](https://claude.com/claude-code)
   ```

3. **리모트 push 및 PR 생성**
   ```bash
   git push -u origin <branch-name>
   gh pr create --title "<title>" --body "<body>"
   ```

4. **결과 출력** — PR URL 표시

## 출력 형식

```
## PR 생성

**브랜치**: feature/app-router → main
**커밋**: 3개
**변경**: +367 -230 (34 files)

### PR
Title: feat: migrate from Pages Router to App Router
URL: https://github.com/...

### 다음 단계
- CI 통과 확인
- 코드 리뷰 (해당 시)
- 머지
```

## 가드레일
- `main` 브랜치에 직접 push하지 않음
- force push 하지 않음
- 커밋되지 않은 변경이 있으면 PR 생성 전 커밋 먼저 제안
- PR 본문에 민감 정보(env, 키 등) 포함하지 않도록 주의
