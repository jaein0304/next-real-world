## ADDED Requirements

### Requirement: User 모델
시스템은 User 모델(`blog_user`)을 제공해야 한다(SHALL). 필드: `id`(Int, auto-increment PK), `username`(String, unique), `email`(String, unique), `password`(String, bcrypt hashed), `bio`(String, nullable), `image`(String, nullable). User는 articles, comments, favorites, followedBy, following 관계를 가진다.

#### Scenario: 유니크 제약조건
- **WHEN** 이미 존재하는 username 또는 email로 User 생성을 시도할 때
- **THEN** Prisma unique constraint 에러(P2002)가 발생해야 한다

#### Scenario: 비밀번호 해싱
- **WHEN** User가 생성될 때
- **THEN** password 필드는 bcrypt(salt 10)로 해싱된 값이 저장되어야 한다

### Requirement: Article 모델
시스템은 Article 모델(`blog_article`)을 제공해야 한다(SHALL). 필드: `id`(Int, PK), `slug`(String, unique), `title`(String), `description`(String), `body`(Text), `createdAt`(DateTime), `updatedAt`(DateTime), `del`(Boolean, default false), `favoritesCount`(Int, default 0), `authorId`(Int, FK→User). 관계: author(User), tags(ArticlesTags), favoritedBy(Favorites), comments(Comment).

#### Scenario: 소프트 삭제
- **WHEN** Article을 삭제할 때
- **THEN** `del` 필드가 `true`로 설정되어야 하며, 실제 DB 레코드는 유지되어야 한다

#### Scenario: Slug 생성
- **WHEN** Article이 생성될 때
- **THEN** slug는 title을 slug화한 값 + 랜덤 suffix 형식이어야 한다

### Requirement: Comment 모델
시스템은 Comment 모델(`blog_comment`)을 제공해야 한다(SHALL). 필드: `id`(Int, PK), `body`(VarChar 1024), `createdAt`(DateTime), `updatedAt`(DateTime), `del`(Boolean, default false), `articleId`(Int, FK→Article), `authorId`(Int, FK→User).

#### Scenario: 소프트 삭제
- **WHEN** Comment를 삭제할 때
- **THEN** `del` 필드가 `true`로 설정되어야 한다

### Requirement: Tag 모델
시스템은 Tag 모델(`blog_tag`)을 제공해야 한다(SHALL). 필드: `id`(Int, PK), `name`(String, unique). ArticlesTags 조인 테이블(`blog_articles_tags`)로 Article과 다대다 관계. 복합 PK: [articleId, tagId].

#### Scenario: 태그 유니크
- **WHEN** 동일한 name의 Tag 생성을 시도할 때
- **THEN** 기존 Tag를 재사용(connectOrCreate)해야 한다

### Requirement: Follows 관계
시스템은 Follows 조인 테이블(`blog_follows`)을 제공해야 한다(SHALL). 복합 PK: [followerId, followingId]. User 간 다대다 자기 참조 관계(follower↔following).

#### Scenario: 팔로우 관계 생성
- **WHEN** User A가 User B를 팔로우할 때
- **THEN** Follows 테이블에 [A.id, B.id] 레코드가 생성되어야 한다

### Requirement: Favorites 관계
시스템은 Favorites 조인 테이블(`blog_favorites`)을 제공해야 한다(SHALL). 복합 PK: [articleId, userId]. Article과 User 간 다대다 관계.

#### Scenario: 즐겨찾기 시 카운트 증가
- **WHEN** User가 Article을 즐겨찾기할 때
- **THEN** Favorites 레코드가 생성되고 Article의 `favoritesCount`가 1 증가해야 한다

### Requirement: Prisma 싱글톤
시스템은 PrismaClient를 글로벌 싱글톤으로 관리해야 한다(MUST). 개발 환경에서 hot reload 시 다중 인스턴스 생성을 방지한다. 로깅 레벨 4개: query(event), error(event), info(stdout), warn(stdout). 개발 환경에서만 `$on('query', ...)` 이벤트 구독으로 쿼리 로그(params 포함) 출력.

#### Scenario: 개발 환경 싱글톤
- **WHEN** 개발 서버에서 hot reload가 발생할 때
- **THEN** 동일한 PrismaClient 인스턴스가 재사용되어야 한다
