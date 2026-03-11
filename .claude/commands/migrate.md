---
name: Migrate
description: Prisma 마이그레이션 실행 및 production/test 스키마 동기화
category: Database
tags: [prisma, migration, database]
---

Prisma 스키마 변경 시 마이그레이션을 실행하고 production/test 스키마를 동기화한다.

**Input**: 선택적으로 마이그레이션 이름 지정 (`/migrate add-comment-table`)

## 실행 단계

1. **스키마 변경 감지**
   - `prisma/schema.prisma` (production, MySQL) 변경 내용 확인
   - `git diff prisma/schema.prisma`로 변경 사항 요약

2. **Production 마이그레이션 생성**
   ```bash
   npx prisma migrate dev --name <migration-name>
   ```
   - 마이그레이션 이름이 없으면 변경 내용 기반으로 자동 생성

3. **Prisma 클라이언트 재생성**
   ```bash
   npx prisma generate
   ```

4. **Test 스키마 동기화**
   - `prisma/schema.prisma`의 model 변경 사항을 `prisma/schema.test.prisma`에 반영
   - 주의: MySQL 전용 어노테이션(`@db.Text`, `@db.VarChar(...)`) 제거
   - SQLite 비호환 타입 변환 (예: `DateTime @default(now())` 유지, `@db.Text` 제거)

5. **Test 클라이언트 재생성**
   ```bash
   npx prisma generate --schema=prisma/schema.test.prisma
   ```

6. **검증**
   - `npx tsc --noEmit`으로 타입 검사
   - 기존 테스트 실행하여 호환성 확인

## 출력 형식

```
## Prisma Migration

### 변경 사항
- User 모델에 `avatar` 필드 추가

### 실행 결과
✓ Migration created: 20260311_add_avatar_field
✓ Production client regenerated
✓ Test schema synced (prisma/schema.test.prisma)
✓ Test client regenerated
✓ Type check passed

### 동기화된 파일
- prisma/schema.prisma (production)
- prisma/schema.test.prisma (test - SQLite)
- prisma/migrations/20260311_add_avatar_field/
```

## 가드레일
- Production DB에 직접 `db push --force-reset` 절대 사용하지 않음
- Test 스키마 동기화 시 MySQL 전용 어노테이션 자동 제거
- 마이그레이션 생성 전 현재 DB 상태와 스키마 차이 확인
- 코드 생성 순서 준수: Prisma → Nexus → GraphQL codegen
