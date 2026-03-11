## ADDED Requirements

### Requirement: GraphQL 엔드포인트
시스템은 `/api` 경로에 단일 GraphQL 엔드포인트를 제공해야 한다(SHALL). Apollo Server(micro)로 구현. CORS 활성화, CSRF 방지, introspection은 개발 환경에서만 허용. Persisted queries TTL 1500초. 캐시 제어 기본 maxAge 5초.

#### Scenario: GraphQL 쿼리 실행
- **WHEN** `/api`에 유효한 GraphQL 쿼리를 POST할 때
- **THEN** JSON 형식의 GraphQL 응답이 반환되어야 한다

#### Scenario: Production에서 introspection 차단
- **WHEN** Production 환경에서 introspection 쿼리를 실행할 때
- **THEN** 요청이 거부되어야 한다

### Requirement: Nexus Code-First 스키마
시스템은 Nexus를 사용하여 code-first 방식으로 GraphQL 스키마를 정의해야 한다(MUST). 생성 파일: `generated/schema.graphql`(SDL), `generated/nexus.ts`(타입). 플러그인: `fieldAuthorizePlugin`(인가), `validatePlugin`(Yup 검증→UserInputError). 기본 타입: `Node` 인터페이스(`lib/api/types/base.type.ts`, id: Int 필수), `DateTime` 커스텀 스칼라(`lib/api/types/scalar.type.ts`, `graphql-scalars`의 `DateTimeResolver` 사용).

#### Scenario: 스키마 생성
- **WHEN** `yarn generate:nexus`를 실행할 때
- **THEN** `generated/schema.graphql`과 `generated/nexus.ts`가 생성되어야 한다

### Requirement: User Queries
시스템은 다음 쿼리를 제공해야 한다(SHALL):
- `profile(username: String!): Profile` — 공개, 사용자 프로필 조회
- `currentUser: AuthUser!` — 인증 필수, 현재 로그인 사용자 정보
- `checkUsername(username: String!): String` — 인증 필수, 사용자명 중복 확인 (존재 시 해당 username 반환, 미존재 시 null)
- `checkEmail(email: String!): String` — 인증 필수, 이메일 중복 확인 (존재 시 해당 email 반환, 미존재 시 null)

#### Scenario: 비인증 사용자가 currentUser 조회
- **WHEN** 인증 토큰 없이 `currentUser` 쿼리를 실행할 때
- **THEN** AuthenticationError가 반환되어야 한다

#### Scenario: 프로필 조회
- **WHEN** 존재하는 username으로 `profile` 쿼리를 실행할 때
- **THEN** username, bio, image, following 정보가 반환되어야 한다

### Requirement: Article Queries
시스템은 다음 쿼리를 제공해야 한다(SHALL):
- `article(slug: String!): Article` — 단일 글 조회 (del=false만)
- `articles(author?, tag?, favorited?, limit=10, offset=0, cursor?): [Article!]!` — 글 목록, cursor-based 페이지네이션
- `articlesCount(author?, tag?, favorited?): Int!` — 필터 기준 총 개수
- `feed(limit=10, offset=0, cursor?): [Article!]!` — 인증 필수, 팔로우한 사용자의 글
- `feedCount: Int!` — 인증 필수, 피드 총 개수

#### Scenario: 태그 기반 필터링
- **WHEN** `articles(tag: "react")`를 실행할 때
- **THEN** "react" 태그가 포함된 글만 반환되어야 한다

#### Scenario: Cursor 기반 페이지네이션
- **WHEN** `articles(cursor: 10, limit: 5)`를 실행할 때
- **THEN** id가 10보다 작은 글 5개가 최신순으로 반환되어야 한다

### Requirement: Comment Queries
시스템은 `comments(articleId: Int!, limit=20, offset=0, cursor?): [Comment!]!` 쿼리를 제공해야 한다(SHALL). 생성일 오름차순 정렬, del=false만.

#### Scenario: 글의 댓글 조회
- **WHEN** 유효한 articleId로 `comments`를 실행할 때
- **THEN** 해당 글의 댓글이 생성일 오름차순으로 반환되어야 한다

### Requirement: Tag Queries
시스템은 `tags: [String!]!` 쿼리를 제공해야 한다(SHALL). 글 수 내림차순 상위 27개 태그의 이름 목록 반환. 글이 0개인 태그는 제외.

#### Scenario: 인기 태그 조회
- **WHEN** `tags` 쿼리를 실행할 때
- **THEN** 최대 27개 태그가 글 수 내림차순으로 반환되어야 한다

### Requirement: User Mutations
시스템은 다음 뮤테이션을 제공해야 한다(SHALL):
- `login(input: UserLoginInput!): AuthUser!` — 로그인, JWT 토큰 발급
- `signup(input: UserSignupInput!): AuthUser` — 회원가입, nullable. 중복(P2002) 시 `UserInputError('Username or email had been used')` throw. P2002 외 예외 시 null 반환
- `updateUser(input: UserUpdateInput!): AuthUser!` — 인증 필수, 프로필 수정

#### Scenario: 로그인 성공
- **WHEN** 유효한 email/password로 `login`을 실행할 때
- **THEN** id, username, email, bio, image, token이 포함된 AuthUser가 반환되어야 한다

#### Scenario: 중복 회원가입 (username/email 이미 존재)
- **WHEN** 이미 존재하는 email 또는 username으로 `signup`을 실행할 때
- **THEN** `UserInputError('Username or email had been used')`가 throw되어야 한다

### Requirement: Article Mutations
시스템은 다음 뮤테이션을 제공해야 한다(SHALL). 모두 인증 필수:
- `createArticle(input: ArticleInput!): Article!` — 글 생성, 태그 connect/create
- `updateArticle(slug: String!, input: ArticleInput!): Article!` — 글 수정, 소유자만
- `deleteArticle(slug: String!): Article!` — 소프트 삭제, 소유자만, 관련 태그/즐겨찾기/댓글도 처리
- `favorite(slug: String!): Article!` — 즐겨찾기 추가, favoritesCount+1
- `unfavorite(slug: String!): Article!` — 즐겨찾기 해제, favoritesCount-1

#### Scenario: 글 생성
- **WHEN** 인증된 사용자가 유효한 ArticleInput으로 `createArticle`을 실행할 때
- **THEN** slug가 자동 생성되고, 태그가 연결된 Article이 반환되어야 한다

#### Scenario: 타인의 글 수정 시도
- **WHEN** 글 소유자가 아닌 사용자가 `updateArticle`을 실행할 때
- **THEN** 에러가 반환되어야 한다

### Requirement: Comment Mutations
시스템은 다음 뮤테이션을 제공해야 한다(SHALL). 모두 인증 필수:
- `createComment(slug: String!, input: CommentInput!): Comment!` — 댓글 생성
- `deleteComment(id: Int!): Comment!` — 소프트 삭제

#### Scenario: 댓글 생성
- **WHEN** 인증된 사용자가 유효한 slug와 CommentInput으로 `createComment`을 실행할 때
- **THEN** 새 Comment가 생성되어 반환되어야 한다

### Requirement: Profile Mutations
시스템은 다음 뮤테이션을 제공해야 한다(SHALL). 모두 인증 필수:
- `follow(username: String!): Profile!` — 팔로우 (connectOrCreate)
- `unFollow(username: String!): Profile!` — 언팔로우

#### Scenario: 팔로우
- **WHEN** 인증된 사용자가 `follow(username: "bob")`을 실행할 때
- **THEN** Profile의 `following`이 `true`인 응답이 반환되어야 한다

### Requirement: GraphQL Context
시스템은 `lib/api/context.ts`에서 GraphQL Context 인터페이스를 정의해야 한다(MUST). 구조: `{ prisma: PrismaClient; currentUser?: { id: number } }`. 매 요청마다 Authorization 헤더에서 JWT를 추출하여 `currentUser`를 설정. 토큰이 없거나 유효하지 않으면 `currentUser`는 undefined.

#### Scenario: Context 생성
- **WHEN** GraphQL 요청이 유효한 JWT와 함께 도착할 때
- **THEN** context에 `prisma` 클라이언트와 `currentUser: { id: <userId> }`가 설정되어야 한다

### Requirement: GraphQL 클라이언트 스키마 파일
시스템은 `lib/schemas/` 디렉토리에 7개의 `.graphql` 파일로 클라이언트 GraphQL 오퍼레이션을 정의해야 한다(SHALL):
- `auth.graphql` — Login, Signup mutations, CurrentUser/CheckUsername/CheckEmail queries
- `article-list.graphql` — Articles, ArticlesCount, Feed, FeedCount queries, Favorite/Unfavorite mutations, ArticlePreview/Favorites fragments
- `article.graphql` — Article, ArticleMeta, Comments queries, CreateComment/DeleteComment/DeleteArticle mutations, ArticleView/CommentView fragments
- `editor.graphql` — CreateArticle, UpdateArticle mutations, EditArticle query
- `home.graphql` — Tags query
- `profile.graphql` — Profile query, Follow/UnFollow mutations, Follows fragment
- `settings.graphql` — UpdateUser mutation

#### Scenario: 전체 오퍼레이션 코드 생성
- **WHEN** `yarn generate:graphql`을 실행할 때
- **THEN** 7개 .graphql 파일의 모든 query, mutation, fragment에 대한 TypeScript 타입과 React Apollo 훅이 `generated/graphql.ts`에 생성되어야 한다

### Requirement: 에러 포맷팅
시스템은 GraphQL 에러를 다음 규칙으로 포맷해야 한다(MUST):
- "Not authorized" → `AuthenticationError("unauthorized")`
- prisma/database 에러 → `ApolloError("Internal server error", "INTERNAL_SERVER_ERROR")` (원본 메시지 숨김)
- 기타 → 그대로 반환

#### Scenario: DB 에러 마스킹
- **WHEN** Prisma 에러가 발생할 때
- **THEN** 클라이언트에 "Internal server error"만 반환되어야 하고, DB 상세 정보는 노출되지 않아야 한다
