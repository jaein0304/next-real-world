## ADDED Requirements

### Requirement: Layout 컴포넌트
시스템은 모든 페이지를 감싸는 Layout 컴포넌트를 제공해야 한다(SHALL). 구성: `DefaultSeo` + flex column(`Header` + 페이지 컨텐츠 + `Footer` + `Toast`). next-seo로 기본 SEO 메타데이터 설정.

#### Scenario: 모든 페이지에 공통 레이아웃
- **WHEN** 어떤 페이지를 렌더링할 때
- **THEN** Header(네비게이션), Footer, Toast가 항상 표시되어야 한다

### Requirement: Header/NavBar 컴포넌트
시스템은 Header에 반응형 네비게이션을 제공해야 한다(SHALL). 미인증: Home, Sign in, Sign up 링크. 인증: Home, New Article, Settings, 프로필(이미지+username) 링크. 현재 페이지 활성 표시.

#### Scenario: 인증 상태에 따른 네비게이션
- **WHEN** 인증된 사용자가 페이지를 볼 때
- **THEN** New Article, Settings, 프로필 링크가 표시되어야 한다

### Requirement: ArticlePreview 컴포넌트
시스템은 글 목록에서 각 글을 ArticlePreview로 표시해야 한다(SHALL). 표시 정보: author(이미지+username), 작성일, 즐겨찾기 버튼+카운트, title, description, tagList. 클릭 시 글 상세로 이동.

#### Scenario: 글 미리보기 표시
- **WHEN** 글 목록을 렌더링할 때
- **THEN** 각 글에 author, 날짜, 제목, 설명, 태그가 표시되어야 한다

### Requirement: ArticlesViewer 컴포넌트
시스템은 ArticlesViewer로 탭 기반 글 목록을 제공해야 한다(SHALL). 탭 전환으로 데이터 소스 변경. 페이지네이션(Pagination) 및 더보기(LoadMore, ReverseLoadMore) 지원. `usehooks-ts`의 `useCountdown` 훅으로 15초 카운트다운 후 더보기 버튼 활성화.

#### Scenario: 15초 카운트다운 후 더보기 활성화
- **WHEN** 글 목록이 표시된 상태에서 15초 카운트다운이 완료될 때
- **THEN** 더보기(LoadMore/ReverseLoadMore) 버튼이 활성화되어 사용자가 클릭하여 새 글을 로드할 수 있어야 한다

### Requirement: CommentSection 컴포넌트
시스템은 글 상세 페이지에 CommentSection을 제공해야 한다(SHALL). CommentForm(인증 시)으로 새 댓글 작성. 댓글 목록(ArticleComment)으로 기존 댓글 표시. 본인 댓글에 삭제 버튼. 15초 카운트다운 후 더보기 버튼 활성화(`COMMENTS_FETCH_MORE_INTERVAL = 15`).

#### Scenario: 댓글 작성
- **WHEN** 인증된 사용자가 댓글 폼에 텍스트를 입력하고 제출할 때
- **THEN** createComment mutation이 실행되고 댓글 목록에 새 댓글이 추가되어야 한다

### Requirement: 폼 시스템 (GenericForm + React Hook Form)
시스템은 React Hook Form 기반 폼 시스템을 제공해야 한다(SHALL). GenericForm이 form 래퍼 역할. FormInput/TextAreaInput이 필드 컴포넌트. Yup resolver로 클라이언트 검증. FormErrorMessage로 필드별 에러 표시. TagInput으로 태그 입력/삭제.

#### Scenario: 폼 유효성 검증 실패
- **WHEN** 필수 필드를 비우고 폼을 제출할 때
- **THEN** 해당 필드 아래에 에러 메시지가 표시되어야 한다

### Requirement: FavoritesButton / FollowsButton
시스템은 즐겨찾기/팔로우 토글 버튼을 제공해야 한다(SHALL). 현재 상태(favorited/following)에 따라 스타일 변경. 클릭 시 mutation 실행. 미인증 시 `/login`으로 이동.

#### Scenario: 미인증 사용자가 즐겨찾기 클릭
- **WHEN** 미인증 사용자가 FavoritesButton을 클릭할 때
- **THEN** `/login` 페이지로 이동해야 한다

### Requirement: CustomImage 컴포넌트
시스템은 `next/image` (`Image`) 래퍼인 CustomImage를 제공해야 한다(SHALL). 모든 이미지에 `unoptimized` prop을 설정하여 도메인 제한 없이 `next/image`로 렌더링. 기본 아바타 플레이스홀더(`DEFAULT_AVATAR_PLACEHOLDER`, `DEFAULT_AVATAR`) 지원. Next.js config에 허용 도메인(`s2.loli.net`, `i.imgur.com`)이 설정되어 있으나, CustomImage는 `unoptimized`로 동작하므로 도메인 분기 없음.

#### Scenario: 외부 도메인 이미지 표시
- **WHEN** 임의의 외부 도메인 이미지를 표시할 때
- **THEN** `next/image`에 `unoptimized` prop이 적용되어 최적화 없이 렌더링되어야 한다

#### Scenario: 기본 아바타
- **WHEN** 사용자 이미지가 없을 때
- **THEN** `DEFAULT_AVATAR` base64 이미지가 표시되어야 한다

### Requirement: Markdown 렌더링
시스템은 `lib/utils/markdown.ts`의 `Markdown` 싱글톤 클래스를 통해 마크다운을 HTML로 변환해야 한다(SHALL). `marked` 라이브러리로 파싱, `highlight.js`로 코드 구문 강조. 지원 언어(`config.js`의 `supportedHighlightLangs`): javascript, python, ruby, json, yaml, typescript, bash, java. 테마: Tokyo Night Dark. `Markdown.render(body)` 메서드가 HTML 문자열을 반환.

#### Scenario: 코드 블록 구문 강조
- **WHEN** 마크다운에 ```javascript 코드 블록이 포함될 때
- **THEN** Tokyo Night Dark 테마로 구문 강조되어 렌더링되어야 한다

### Requirement: Wrapper 컴포넌트 (NextSeo)
시스템은 `components/common/wrapper.tsx`의 Wrapper 컴포넌트로 개별 페이지의 SEO 메타데이터를 설정해야 한다(SHALL). Layout의 `DefaultSeo`와 별개로, 각 페이지에서 `NextSeo`를 래핑하여 title, description 등을 오버라이드.

#### Scenario: 페이지별 SEO 설정
- **WHEN** 글 상세 페이지를 렌더링할 때
- **THEN** 해당 글의 title, description이 SEO 메타태그로 설정되어야 한다

### Requirement: ReverseLoadMore 컴포넌트
시스템은 `components/common/reverse-load-more.tsx`의 ReverseLoadMore 컴포넌트로 양방향(상단+하단) 더보기를 지원해야 한다(SHALL). `usehooks-ts`의 `useCountdown` 훅으로 카운트다운 관리. 카운트다운 완료 시 버튼 활성화.

#### Scenario: 양방향 더보기
- **WHEN** 목록의 상단과 하단에 더 불러올 데이터가 있을 때
- **THEN** 상단(새 데이터)과 하단(이전 데이터) 양쪽에 더보기 버튼이 표시되어야 한다

### Requirement: 스타일 유틸리티
시스템은 `lib/utils/styles-builder.ts`에서 Ramda 기반 스타일 유틸리티 함수를 제공해야 한다(SHALL). `joinStyles`와 `joinStylesFromArray`로 조건부 CSS 클래스 결합.

#### Scenario: 조건부 클래스 결합
- **WHEN** 여러 CSS 클래스를 조건에 따라 결합할 때
- **THEN** Ramda를 사용하여 falsy 값을 필터링하고 공백으로 결합된 문자열을 반환해야 한다
