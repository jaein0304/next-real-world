## ADDED Requirements

### Requirement: 홈 페이지 (/)
시스템은 루트 경로에 홈 페이지를 제공해야 한다(SHALL). 탭 기반 뷰: "Your Feed"(인증 시만 표시, 팔로우한 사용자의 글), "Global Feed"(전체 글), 태그 클릭 시 태그 필터 탭. 사이드바에 인기 태그(최대 27개) 표시. 미인증 시 배너(타이틀 + CTA) 표시.

#### Scenario: 미인증 사용자 홈 접근
- **WHEN** 미인증 사용자가 `/`에 접근할 때
- **THEN** 배너 + Global Feed 탭 + 사이드바 태그가 표시되어야 한다

#### Scenario: 인증 사용자 홈 접근
- **WHEN** 인증된 사용자가 `/`에 접근할 때
- **THEN** Your Feed + Global Feed 탭이 표시되고, 기본 탭은 Your Feed여야 한다

#### Scenario: 태그 클릭 필터
- **WHEN** 사이드바에서 태그를 클릭할 때
- **THEN** 해당 태그로 필터링된 글 목록 탭이 추가되어야 한다

### Requirement: 로그인 페이지 (/login)
시스템은 `/login` 경로에 로그인 폼을 제공해야 한다(SHALL). guestOnly HOC 적용. 필드: email, password. 성공 시 토큰 저장 + 홈으로 이동.

#### Scenario: 로그인 성공
- **WHEN** 유효한 email/password로 로그인할 때
- **THEN** 토큰이 localStorage에 저장되고 `/`로 이동해야 한다

### Requirement: 회원가입 페이지 (/register)
시스템은 `/register` 경로에 회원가입 폼을 제공해야 한다(SHALL). guestOnly HOC 적용. 필드: username, email, password. 성공 시 토큰 저장 + 홈으로 이동.

#### Scenario: 회원가입 성공
- **WHEN** 유효한 username/email/password로 가입할 때
- **THEN** 계정이 생성되고, 토큰이 저장되며, `/`로 이동해야 한다

### Requirement: 설정 페이지 (/settings)
시스템은 `/settings` 경로에 사용자 설정 폼을 제공해야 한다(SHALL). withAuth HOC 적용. 필드: image URL, username, bio, email, password. 로그아웃 버튼 포함(토큰 삭제 + Apollo 캐시 초기화).

#### Scenario: 프로필 업데이트
- **WHEN** 설정 폼에서 username을 변경하고 제출할 때
- **THEN** 서버에 updateUser mutation이 실행되고 변경사항이 반영되어야 한다

#### Scenario: 로그아웃
- **WHEN** 로그아웃 버튼을 클릭할 때
- **THEN** localStorage의 토큰이 삭제되고 Apollo 캐시가 초기화되어야 한다

### Requirement: 글 상세 페이지 (/article/[slug])
시스템은 `/article/[slug]` 경로에 글 상세 페이지를 제공해야 한다(SHALL). SSR 지원(`getServerSideProps`). 마크다운 렌더링(marked + highlight.js). 댓글 섹션(작성 폼 + 목록). 글 작성자: 수정/삭제 버튼. 타인: 팔로우/즐겨찾기 버튼.

#### Scenario: SSR로 글 로드
- **WHEN** `/article/my-article-slug`에 접근할 때
- **THEN** 서버에서 글 데이터를 프리페치하여 HTML에 포함해야 한다

#### Scenario: 마크다운 렌더링
- **WHEN** 글 본문에 마크다운과 코드 블록이 포함되어 있을 때
- **THEN** HTML로 변환되고, 코드 블록은 highlight.js로 구문 강조되어야 한다

### Requirement: 글 작성/수정 페이지 (/editor)
시스템은 `/editor`(신규)와 `/editor/[slug]`(수정) 경로에 글 에디터를 제공해야 한다(SHALL). withAuth HOC 적용. 필드: title, description, body, tagList. 수정 시 기존 글 데이터 프리로드.

#### Scenario: 새 글 작성
- **WHEN** `/editor`에서 폼을 작성하고 제출할 때
- **THEN** createArticle mutation이 실행되고 `/article/[slug]`로 이동해야 한다

#### Scenario: 글 수정
- **WHEN** `/editor/[slug]`에 접근할 때
- **THEN** 기존 글의 title, description, body, tagList가 폼에 채워져야 한다

### Requirement: 프로필 페이지 (/profile/[username])
시스템은 `/profile/[username]` 경로에 사용자 프로필을 제공해야 한다(SHALL). 프로필 정보(username, bio, image). 팔로우/언팔로우 버튼(타인일 때). 설정 버튼(본인일 때). 탭: "My Articles", "Favorited Articles".

#### Scenario: 타인 프로필 조회
- **WHEN** 다른 사용자의 프로필 페이지에 접근할 때
- **THEN** 프로필 정보와 팔로우 버튼이 표시되어야 한다

### Requirement: 404 페이지
시스템은 존재하지 않는 경로에 대해 커스텀 404 페이지를 표시해야 한다(SHALL).

#### Scenario: 잘못된 경로 접근
- **WHEN** 존재하지 않는 URL에 접근할 때
- **THEN** 커스텀 404 페이지가 표시되어야 한다
