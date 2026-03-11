## ADDED Requirements

### Requirement: Apollo Client 이중 인스턴스 아키텍처
시스템은 2개의 Apollo Client 인스턴스를 사용해야 한다(MUST):
1. **SSR용 (default export, `lib/client/apollo-client.ts`)**: 링크 체인 `errorLink → cacheLink → httpLink` (authLink 없음). `ssrMode: typeof window === 'undefined'`. `getServerSideProps`에서 직접 사용.
2. **CSR용 (`CustomApolloProvider`, `lib/hooks/use-apollo.tsx`)**: 링크 체인 `errorLink → authLink → cacheLink → httpLink`. `ssrMode` 미설정. 브라우저에서 사용.

httpLink 대상: `${BASE_URL}/api` (절대 URL. dev: `http://localhost:3000/api`, prod: `https://next-real-world.vercel.app/api`). Persisted queries는 `crypto-hash` 패키지의 SHA256 해싱 사용, GET 요청으로 전환. 개발 환경에서 DevTools 연결.

#### Scenario: CSR 요청 링크 체인
- **WHEN** 브라우저에서 GraphQL 요청을 보낼 때
- **THEN** error 처리 → 인증 헤더 주입(authLink) → persisted query hash → HTTP 전송 순서로 처리되어야 한다

#### Scenario: SSR 요청
- **WHEN** `getServerSideProps`에서 GraphQL 쿼리를 실행할 때
- **THEN** SSR용 클라이언트(authLink 없음)로 `${BASE_URL}/api`에 요청해야 한다

#### Scenario: Persisted Queries
- **WHEN** 동일한 쿼리를 반복 실행할 때
- **THEN** `crypto-hash`의 SHA256 해시 기반 GET 요청으로 전환되어 네트워크 효율이 향상되어야 한다

### Requirement: Apollo Cache 정책
시스템은 InMemoryCache에 다음 typePolicies를 설정해야 한다(MUST):
- keyFields: Article(`id`), Comment(`id`), AuthUser(`id`), Profile(`username`), Tag(`name`)
- Query merge 함수: `feed`(keyArgs=[]), `articles`(keyArgs=[author, favorited, tag]), `comments`(keyArgs=[articleId]) — cursor 기반 중복 제거 병합

#### Scenario: 페이지네이션 캐시 병합
- **WHEN** articles를 offset=0으로 조회 후 offset=10으로 추가 조회할 때
- **THEN** 두 결과가 중복 없이 병합되어 캐시에 저장되어야 한다

#### Scenario: 태그 필터 캐시 분리
- **WHEN** `articles(tag: "react")`와 `articles(tag: "vue")`를 조회할 때
- **THEN** 각각 별도의 캐시 엔트리로 저장되어야 한다

### Requirement: Provider 구성
시스템은 `Compose` 유틸리티로 다음 Provider를 합성해야 한다(SHALL): `TokenProvider → CustomApolloProvider → MessageProvider`. Compose는 `reduceRight`로 Provider를 중첩하여 외부→내부 순서를 보장.

#### Scenario: Provider 순서 보장
- **WHEN** 앱이 마운트될 때
- **THEN** TokenProvider가 최외곽, ApolloProvider가 중간, MessageProvider가 최내곽에 위치해야 한다

### Requirement: 에러 처리 링크
시스템은 `errorLink`에서 개발 환경에서만 GraphQL/네트워크 에러를 콘솔에 출력해야 한다(SHALL). Production에서는 에러 로그 미출력.

#### Scenario: 개발 환경 에러 로깅
- **WHEN** 개발 환경에서 GraphQL 에러가 발생할 때
- **THEN** 에러 메시지, 위치, 경로가 콘솔에 출력되어야 한다

### Requirement: 메시지/에러 핸들링
시스템은 `MessageProvider`를 통해 toast/alert 메시지를 관리해야 한다(SHALL). 메시지 타입: error, info, success. 알림 방식: alert, toast, none. UNAUTHENTICATED 에러 시 Apollo store 초기화 + `/login` 리다이렉트. 라우트 변경 시 메시지 자동 해제.

#### Scenario: 인증 만료 시 자동 로그아웃
- **WHEN** API가 UNAUTHENTICATED 에러를 반환할 때
- **THEN** Apollo 캐시가 초기화되고 `/login`으로 리다이렉트되어야 한다

### Requirement: useCurrentUser 훅
시스템은 `useCurrentUser` 훅을 제공해야 한다(SHALL). 토큰이 있으면 `currentUser` 쿼리를 실행(cache-first → cache-only). `{ user, loading }` 반환. 토큰이 없으면 쿼리 미실행.

#### Scenario: 토큰 존재 시 사용자 조회
- **WHEN** localStorage에 유효한 토큰이 있을 때
- **THEN** `currentUser` 쿼리가 실행되어 user 데이터를 반환해야 한다

### Requirement: GraphQL 코드 생성
시스템은 `graphql-codegen`으로 `lib/schemas/*.graphql`(7개 파일)에서 TypeScript 타입과 React Apollo 훅을 생성해야 한다(SHALL). 출력: `generated/graphql.ts`. 스키마 소스: `http://localhost:3000/api` (dev 서버 실행 필수). 플러그인: typescript, typescript-operations, typescript-react-apollo.

#### Scenario: 코드 생성 실행
- **WHEN** dev 서버 실행 중에 `yarn generate:graphql`을 실행할 때
- **THEN** `generated/graphql.ts`에 타입, 쿼리/뮤테이션 훅이 생성되어야 한다

### Requirement: usePush / useReplace 라우터 훅
시스템은 `lib/hooks/use-router-methods.ts`에서 `usePush`와 `useReplace` 훅을 제공해야 한다(SHALL). `useRouter`의 `push`/`replace`를 ref로 감싸 stale closure 문제를 방지. 리렌더링 없이 안정적인 참조 유지.

#### Scenario: 라우터 메서드 안정적 참조
- **WHEN** 컴포넌트가 리렌더링될 때
- **THEN** `usePush`/`useReplace`가 반환하는 함수 참조가 변경되지 않아야 한다

### Requirement: usePrevious 훅
시스템은 `lib/hooks/use-previous.ts`에서 `usePrevious<T>` 훅을 제공해야 한다(SHALL). ref를 사용하여 이전 렌더 사이클의 값을 반환.

#### Scenario: 이전 값 추적
- **WHEN** state가 A에서 B로 변경될 때
- **THEN** `usePrevious`는 A를 반환해야 한다

### Requirement: useFormCallback 훅
시스템은 `lib/hooks/use-form-callback.ts`에서 `useFormCallback` 훅을 제공해야 한다(SHALL). React Hook Form의 `useController`와 통합하여 폼 필드의 watch(실시간 검증 트리거), dismiss(메시지 해제), clear(제출 성공 시 필드 초기화) 기능을 담당. mutation 래핑과는 무관.

#### Scenario: 필드 변경 시 실시간 검증
- **WHEN** watch 옵션이 활성화된 폼 필드의 값이 변경될 때
- **THEN** 해당 필드의 유효성 검증이 즉시 트리거되어야 한다

### Requirement: 외부 유틸리티 의존성
시스템은 다음 외부 라이브러리를 유틸리티 목적으로 사용해야 한다(SHALL):
- `usehooks-ts`: `useLocalStorage`(토큰 저장), `useCountdown`(더보기 카운트다운)
- `ramda`: 함수형 데이터 변환 (캐시 병합, 스타일 결합, 플러그인 조합 등)
- `@react-spring/web`: 애니메이션 효과
- `get-user-locale`: 사용자 로케일 감지 (date-fns 로케일 선택에 사용)
- `crypto-hash`: Persisted queries의 SHA256 해싱
- `graphql-scalars`: DateTime 커스텀 스칼라 타입

#### Scenario: 로케일 기반 날짜 포맷
- **WHEN** 날짜를 표시할 때
- **THEN** `get-user-locale`로 감지한 로케일(ja 또는 en-US)에 맞는 date-fns 포맷을 적용해야 한다
