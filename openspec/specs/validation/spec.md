## ADDED Requirements

### Requirement: 클라이언트-서버 공유 Yup 스키마
시스템은 `lib/validation/schema.ts`에 Yup 검증 스키마를 정의하여 클라이언트(React Hook Form)와 서버(Nexus validatePlugin)에서 동일한 검증 규칙을 공유해야 한다(MUST).

#### Scenario: 동일한 검증 규칙 적용
- **WHEN** 클라이언트에서 폼 제출과 서버에서 mutation 실행 시
- **THEN** 동일한 Yup 스키마로 검증되어야 한다

### Requirement: User 필드 검증 규칙
시스템은 다음 검증 규칙을 적용해야 한다(MUST):
- `username`: 필수, trim, 최대 100자
- `email`: 필수, trim, 유효한 이메일 형식, 최대 100자
- `password`: trim, 최대 100자 (로그인/가입 시 필수, 설정 변경 시 선택)
- `bio`: trim, 최대 300자, nullable
- `image`: trim, 유효한 URL, 최대 1024자, nullable

#### Scenario: 이메일 형식 검증
- **WHEN** "invalid-email" 형식으로 이메일을 입력할 때
- **THEN** "Invalid email" 에러가 반환되어야 한다

#### Scenario: Username 길이 초과
- **WHEN** 100자를 초과하는 username을 입력할 때
- **THEN** "Username is too long" 에러가 반환되어야 한다

### Requirement: Article 필드 검증 규칙
시스템은 다음 검증 규칙을 적용해야 한다(MUST):
- `title`: 필수, trim, 최대 100자
- `description`: 필수, trim, 최대 255자
- `body`: 필수, trim, 최대 65535자
- `tagList`: 배열, 최소 1개, 각 태그는 필수+trim+최대 100자

#### Scenario: 태그 없이 글 작성
- **WHEN** tagList가 빈 배열인 상태로 글을 작성할 때
- **THEN** "Add at least one tag" 에러가 반환되어야 한다

### Requirement: Comment 필드 검증 규칙
시스템은 댓글 `body` 필드에 대해 필수, trim, 최대 65535자 검증을 적용해야 한다(MUST).

#### Scenario: 빈 댓글 작성 시도
- **WHEN** 빈 문자열로 댓글을 작성할 때
- **THEN** "Comment content is required" 에러가 반환되어야 한다

### Requirement: 로그인/가입 입력 스키마
시스템은 복합 입력 스키마를 제공해야 한다(SHALL):
- `loginInputSchema`: { email(필수), password(필수) }
- `signupInputSchema`: { username(필수), email(필수), password(필수) }
- `updateUserInputSchema`: { username(필수), email(필수), password(선택), bio(선택), image(선택) }
- `articleInputSchema`: { title(필수), description(필수), body(필수), tagList(최소 1개) }
- `commentInputSchema`: { body(필수) }

#### Scenario: 서버 Nexus 검증 에러
- **WHEN** 서버에서 Yup 검증이 실패할 때
- **THEN** `UserInputError`로 변환되어 GraphQL 에러 응답에 포함되어야 한다

### Requirement: 비동기 유니크 검증
시스템은 `useCheckUser` 훅을 통해 username/email의 실시간 중복 검사를 제공해야 한다(SHALL). Yup의 `.test()` 메서드로 `checkUsername`/`checkEmail` GraphQL 쿼리를 실행. 현재 사용자의 값(수정 전)은 검증에서 제외.

#### Scenario: 사용 중인 username 입력
- **WHEN** 다른 사용자가 사용 중인 username을 설정 폼에 입력할 때
- **THEN** "Username had been taken" 에러가 표시되어야 한다
