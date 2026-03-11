## ADDED Requirements

### Requirement: JWT RS256 토큰 발급
시스템은 RS256 알고리즘으로 JWT를 발급해야 한다(MUST). 설정: TTL 2일, Key ID "izayoi". 서명 키: `PRIVATE_JWK` 환경변수(RSA 비밀키 JSON). 페이로드: `{ sub: userId, user: username }`.

#### Scenario: 로그인 시 토큰 발급
- **WHEN** 유효한 자격 증명으로 로그인할 때
- **THEN** RS256으로 서명된 JWT가 반환되어야 하며, payload에 sub(userId)과 user(username)가 포함되어야 한다

#### Scenario: 토큰 만료
- **WHEN** 2일 이상 경과한 토큰으로 API 요청을 할 때
- **THEN** 토큰 검증이 실패해야 한다

### Requirement: JWT 토큰 검증
시스템은 `PUBLIC_JWK`(RSA 공개키, `lib/constants.ts`에 하드코딩)로 JWT를 검증해야 한다(MUST). 요청 헤더 `Authorization: Bearer <token>`에서 토큰 추출.

#### Scenario: 유효한 토큰으로 API 요청
- **WHEN** 유효한 JWT가 Authorization 헤더에 포함된 요청을 보낼 때
- **THEN** GraphQL context에 `currentUser: { id: <userId> }`가 설정되어야 한다

#### Scenario: 토큰 없는 요청
- **WHEN** Authorization 헤더 없이 요청을 보낼 때
- **THEN** context에 `currentUser`가 undefined이어야 하며, 공개 쿼리는 정상 작동해야 한다

### Requirement: 클라이언트 토큰 관리
시스템은 JWT 토큰을 localStorage에 저장하고 `TokenProvider`를 통해 관리해야 한다(SHALL). `useToken()` 훅이 `{ token, handleChangeToken }` 인터페이스를 제공한다. Apollo Client의 `authLink`가 모든 GraphQL 요청에 `Authorization: Bearer <token>` 헤더를 자동 주입한다.

#### Scenario: 로그인 후 토큰 저장
- **WHEN** 로그인이 성공하여 토큰이 반환될 때
- **THEN** `handleChangeToken`으로 localStorage에 저장되어야 한다

#### Scenario: 페이지 새로고침 시 토큰 유지
- **WHEN** 페이지를 새로고침할 때
- **THEN** localStorage에서 토큰이 복원되어 인증 상태가 유지되어야 한다

### Requirement: withAuth HOC
시스템은 `withAuth` HOC를 제공해야 한다(SHALL). 인증되지 않은 사용자는 `/login`으로 리다이렉트. 인증 확인 중 `LoadingSpinner`를 표시. 인증된 사용자의 `user` 객체를 컴포넌트 props로 전달.

#### Scenario: 미인증 사용자가 보호된 페이지 접근
- **WHEN** 토큰이 없는 사용자가 withAuth 페이지에 접근할 때
- **THEN** `/login` 페이지로 리다이렉트되어야 한다

### Requirement: guestOnly HOC
시스템은 `guestOnly` HOC를 제공해야 한다(SHALL). 인증된 사용자는 `/`(홈)으로 리다이렉트. 로그인/회원가입 페이지에 적용.

#### Scenario: 인증된 사용자가 로그인 페이지 접근
- **WHEN** 이미 로그인된 사용자가 `/login`에 접근할 때
- **THEN** `/` 페이지로 리다이렉트되어야 한다

### Requirement: JWK 키 쌍 생성
시스템은 `yarn generate:jwk` 명령으로 RSA 키 쌍을 생성할 수 있어야 한다(SHALL). `gen-jwk.js`가 RSA 키 쌍을 생성하여 콘솔에 출력. 생성된 private key를 `PRIVATE_JWK` 환경변수로 설정하고, public key를 `lib/constants.ts`에 하드코딩.

#### Scenario: JWK 생성
- **WHEN** `yarn generate:jwk`를 실행할 때
- **THEN** RSA private/public JWK 쌍이 콘솔에 출력되어야 한다
