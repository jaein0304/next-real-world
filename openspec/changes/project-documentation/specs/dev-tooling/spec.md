## ADDED Requirements

### Requirement: TypeScript 설정
시스템은 strict 모드 TypeScript(4.7.4)를 사용해야 한다(MUST). 타겟: ES2019, JSX preserve, 모듈 해석 node, incremental 빌드 활성화. ts-node는 CommonJS 모듈로 설정(Nexus 코드 생성용).

#### Scenario: 타입 검사
- **WHEN** `npx tsc --noEmit`을 실행할 때
- **THEN** 타입 에러 없이 완료되어야 한다

### Requirement: ESLint 설정
시스템은 `next/core-web-vitals` ESLint 프리셋을 사용해야 한다(SHALL). 비활성 규칙: `@typescript-eslint/no-non-null-assertion`. `yarn lint`로 실행.

#### Scenario: 린트 검사
- **WHEN** `yarn lint`를 실행할 때
- **THEN** 린트 에러 없이 완료되어야 한다

### Requirement: Prettier 설정
시스템은 다음 Prettier 규칙을 적용해야 한다(SHALL): printWidth 120, singleQuote true, jsxSingleQuote true. 들여쓰기: 2칸 스페이스, LF 줄바꿈(editorconfig).

#### Scenario: 코드 포맷팅
- **WHEN** Prettier로 코드를 포맷팅할 때
- **THEN** 120자 너비, 작은따옴표, JSX 작은따옴표 규칙이 적용되어야 한다

### Requirement: Tailwind CSS 설정
시스템은 Tailwind CSS ^3.1.6을 사용해야 한다(SHALL). 컨텐츠 경로: `pages/`, `components/`. 커스텀 색상: primary(#5cb85c) 및 개별 shade(primary-300: #a3d7a3, primary-600: #449d44, primary-700: #419641, primary-800: #398439, primary-900: #2d672d — 400, 500은 미정의). 커스텀 폰트: sans(Noto Sans JP), mono(Source Code Pro, Ubuntu Mono), serif(Noto Serif JP), titillium(titillium web), zen(Zen Kaku Gothic New). PostCSS 플러그인: tailwindcss, autoprefixer, cssnano(production). Typography 플러그인(@tailwindcss/typography). 커스텀 maxWidth: tag-s(180px), tag-m(240px), tag-l(300px), tab(300px).

#### Scenario: 커스텀 색상 사용
- **WHEN** `bg-primary` 클래스를 사용할 때
- **THEN** 배경색이 #5cb85c로 적용되어야 한다

### Requirement: 코드 생성 파이프라인
시스템은 3단계 코드 생성 파이프라인을 제공해야 한다(MUST). 순서가 중요:
1. `yarn generate:prisma` — Prisma Client 생성
2. `yarn generate:nexus` — Nexus GraphQL 스키마 + 타입 생성 (`ts-node --transpile-only lib/api/schema`)
3. `yarn generate:graphql` — 클라이언트 GraphQL 타입 + 훅 생성 (dev 서버 실행 필수)

#### Scenario: 스키마 변경 후 코드 생성
- **WHEN** Prisma 스키마를 변경한 후 코드를 생성할 때
- **THEN** Prisma → Nexus → GraphQL 순서로 실행해야 하며, 순서가 바뀌면 타입 불일치가 발생한다

### Requirement: Husky Git 훅
시스템은 Husky로 pre-commit 훅을 설정하여 커밋 전 `yarn lint`를 자동 실행해야 한다(SHALL).

#### Scenario: 린트 실패 시 커밋 차단
- **WHEN** 린트 에러가 있는 상태에서 커밋을 시도할 때
- **THEN** pre-commit 훅이 커밋을 차단해야 한다

### Requirement: Next.js 설정
시스템은 Next.js 12.2.0을 사용해야 한다(SHALL). React strict mode 활성화. 이미지 허용 도메인: `s2.loli.net`, `i.imgur.com`. Webpack 플러그인: highlight.js 언어 최적화(`config.js`의 `supportedHighlightLangs` 기준), date-fns 로케일 최적화(`config.js`의 `supportedLocales`: ja, en-US). Serverless 배포용 `experimental-serverless-trace` 타겟. `config.js`에서 빌드 설정(지원 언어, 로케일)을 중앙 관리.

#### Scenario: 이미지 최적화
- **WHEN** `s2.loli.net` 도메인의 이미지를 `next/image`로 사용할 때
- **THEN** Next.js 이미지 최적화가 적용되어야 한다

### Requirement: 번들 분석
시스템은 `yarn build:anl` 명령으로 번들 사이즈 분석을 실행할 수 있어야 한다(SHALL). `@next/bundle-analyzer` 사용, `ANALYZE=true` 환경변수로 활성화.

#### Scenario: 번들 분석 실행
- **WHEN** `yarn build:anl`을 실행할 때
- **THEN** 번들 분석 리포트가 브라우저에서 열려야 한다

### Requirement: 배포 구성
시스템은 두 가지 배포 타겟을 지원해야 한다(SHALL):
- **Vercel**: Next.js 기본 배포, `next-real-world.vercel.app`
- **AWS Serverless**: `@sls-next/serverless-component` v3.7.0, S3 버킷 `next-real-world` (ap-northeast-3), `yarn deploy`로 실행

#### Scenario: Vercel 배포
- **WHEN** main 브랜치에 push할 때
- **THEN** Vercel이 자동으로 production 배포를 수행해야 한다
