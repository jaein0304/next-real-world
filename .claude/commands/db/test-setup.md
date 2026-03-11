---
name: "DB: Test Setup"
description: SQLite 테스트 DB 초기화 및 Prisma 클라이언트 생성
category: Database
tags: [prisma, sqlite, test, database]
---

테스트용 SQLite 데이터베이스를 초기화하고 테스트 전용 Prisma 클라이언트를 생성한다.

## 실행 단계

1. **테스트 스키마 확인**
   - `prisma/schema.test.prisma` 파일 존재 여부 확인
   - 없으면 에러 메시지 출력하고 중단

2. **테스트 Prisma 클라이언트 생성**
   ```bash
   npx prisma generate --schema=prisma/schema.test.prisma
   ```

3. **SQLite DB 초기화**
   ```bash
   DATABASE_URL="file:./test.db" npx prisma db push --schema=prisma/schema.test.prisma --force-reset
   ```

4. **검증**
   - 생성된 클라이언트 경로 확인: `node_modules/.prisma/test-client/`
   - SQLite 파일 확인: `prisma/test.db`

## 출력 형식

```
## Test DB Setup

✓ Prisma test client generated (node_modules/.prisma/test-client/)
✓ SQLite DB initialized (prisma/test.db)

Ready for integration tests.
```

## 참고
- Production 스키마: `prisma/schema.prisma` (MySQL)
- Test 스키마: `prisma/schema.test.prisma` (SQLite)
- Test 클라이언트 출력: `node_modules/.prisma/test-client/`
- Integration 테스트에서 `require()` 로 test-client를 동적 로드
