# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A full-stack RealWorld blog application (Conduit) built with Next.js 12, GraphQL (Apollo/Nexus), Prisma (MySQL), and Tailwind CSS.

## Commands

```bash
yarn dev              # Start dev server
yarn build            # Production build
yarn start            # Start production server
yarn lint             # ESLint
yarn deploy           # Serverless deployment (sls --debug)
yarn db:migrate       # Run Prisma migrations
yarn generate:prisma  # Generate Prisma client
yarn generate:nexus   # Generate Nexus GraphQL types (ts-node --transpile-only lib/api/schema)
yarn generate:graphql # Generate client-side GraphQL types (graphql-codegen)
yarn generate:jwk     # Generate JWT key pair for auth
yarn test             # Run unit/integration tests (watch mode)
yarn test:run         # Run tests once
yarn test:coverage    # Run tests with coverage report
yarn test:e2e         # Run Playwright E2E tests
yarn test:e2e:ui      # Run E2E tests with UI
```

Code generation order matters: Prisma → Nexus → GraphQL codegen. After schema changes, regenerate in this order.

**Important**: `generate:graphql` fetches the schema from `http://localhost:3000/api`, so the dev server must be running first.

## Architecture

### API Layer (GraphQL)
- Single GraphQL endpoint at `pages/api/index.ts` using Apollo Server (micro)
- **Nexus code-first schema**: types, queries, and mutations defined in `lib/api/` with TypeScript
- Schema files: `lib/api/schema.ts` (entrypoint), types in `lib/api/types/`, queries in `lib/api/query/`, mutations in `lib/api/mutation/`, generated output in `generated/`
- Authorization: `fieldAuthorizePlugin` for field-level auth checks
- Validation: `nexus-validate` plugin converts Yup schemas to Apollo UserInputError
- Context provides Prisma client + current user (from JWT)

### Authentication
- JWT RS256 with public/private JWK pair (env vars: `PRIVATE_JWK`, `PUBLIC_JWK`)
- Token utilities in `lib/api/utils.ts` (issueToken, verifyToken, loadCurrentUser)
- Frontend: `useToken()` hook with localStorage, Apollo `authLink` injects Bearer token
- Auth HOCs: `lib/auth/with-auth.tsx` (requires login), `lib/auth/guest-only.tsx` (redirects if logged in)

### Data Layer
- Prisma ORM with MySQL — schema in `prisma/schema.prisma`
- Models: User, Article, Comment, Tag with many-to-many relations (Follows, Favorites, ArticlesTags)
- Global Prisma singleton in `lib/api/prisma.ts`
- Soft delete pattern: Article and Comment have `del` boolean field

### Client State & Data Fetching
- Apollo Client with InMemoryCache — custom merge policies for cursor-based pagination
- Cache config in `lib/cache/`; client setup in `lib/client/`
- Apollo links chain: errorLink → authLink → cacheLink (persisted queries) → httpLink
- Client-side GraphQL operations defined in `lib/schemas/*.graphql`
- Generated hooks from `graphql-codegen` for typed queries/mutations

### Key Directories
- `pages/` — Next.js file-based routing (index, login, register, settings, editor, article/[slug], profile/[username])
- `components/` — Feature-based React components
- `lib/api/` — Server-side GraphQL schema, resolvers, types
- `lib/hooks/` — Custom hooks (Apollo, token, message, validation)
- `lib/validation/` — Yup validation schemas (shared between client and server)
- `lib/auth/` — Auth HOCs
- `lib/constants.ts` — Token config, pagination sizes, fetch intervals
- `generated/` — Auto-generated Nexus types and GraphQL client code (do not edit)

### Patterns
- Provider composition via `lib/utils/compose.tsx` wrapping app with TokenProvider, ApolloProvider, MessageProvider
- `useFormCallback` hook manages form field watch/trigger/clear/dismiss interactions
- `GenericForm` component for standard form layouts with React Hook Form + Yup resolver
- Ramda.js used for functional data transformations
- Markdown rendering via `marked` + `highlight.js` for code syntax in articles
- `@tailwindcss/typography` plugin for article prose styling
- `next/image` allowed domains: `s2.loli.net`, `i.imgur.com`

## Commit Convention

Conventional Commits format:

```
feat: add article search functionality
fix: resolve login redirect loop
test: add unit tests for useToken hook
chore: upgrade vitest to v4.1
docs: update CLAUDE.md with test commands
```

Prefixes: `feat:`, `fix:`, `test:`, `chore:`, `docs:`, `refactor:`

Branch naming: `feature/*`, `fix/*`, `chore/*` → PR to `main`

## Work Rules

- 독립적인 작업은 Agent를 활용해 최대한 병렬로 수행한다 (예: 서로 다른 테스트 작성, 독립 브랜치 작업, 리서치 등)

## Code Style

- Prettier: `printWidth: 120`, `singleQuote: true`, `jsxSingleQuote: true`
- ESLint: extends `next/core-web-vitals`
- TypeScript strict mode enabled

## Environment Setup

Copy `.env.example` to `.env` and configure:
- `DATABASE_URL` — MySQL connection string
- `PRIVATE_JWK` — RSA private key (JSON) for signing JWTs (server-side, generate with `yarn generate:jwk`)

`PUBLIC_JWK` is hardcoded in `lib/constants.ts` for client-side token verification.

### GitHub Secrets (for CI/CD)

In repo Settings → Secrets and variables → Actions, add:
- `DATABASE_URL` — Production MySQL connection string
- `PRIVATE_JWK` — RSA private key JSON

Tests use SQLite (`file:./test.db`) so no DB secret needed for CI test jobs.

### Test Infrastructure

- **Unit/Integration**: Vitest (`vitest.config.ts`), tests in `tests/`
- **E2E**: Playwright (`playwright.config.ts`), tests in `e2e/`
- **Test DB**: SQLite via `prisma/schema.test.prisma` (separate from production MySQL schema)
- **Test Prisma client**: Generated to `node_modules/.prisma/test-client/` — run `npx prisma generate --schema=prisma/schema.test.prisma` before integration tests

## OpenSpec Specifications

Project capabilities are documented as specs in `openspec/specs/`. Each spec defines requirements with testable WHEN/THEN scenarios.

| Capability | Path | Description |
|-----------|------|-------------|
| Data Model | `openspec/specs/data-model/spec.md` | Prisma 7 models, relations, constraints, soft delete |
| GraphQL API | `openspec/specs/graphql-api/spec.md` | Queries, mutations, types, context, error formatting |
| Authentication | `openspec/specs/authentication/spec.md` | JWT RS256, token management, Auth HOCs |
| Frontend Architecture | `openspec/specs/frontend-architecture/spec.md` | Apollo Client (dual instance), cache, providers, hooks |
| Pages & Routing | `openspec/specs/pages-and-routing/spec.md` | 11 pages, auth guards, SSR strategy |
| Components | `openspec/specs/components/spec.md` | Layout, forms, article views, UI components |
| Validation | `openspec/specs/validation/spec.md` | Yup schemas, client-server shared validation |
| Dev Tooling | `openspec/specs/dev-tooling/spec.md` | TS, ESLint, Prettier, Tailwind, code gen, deploy |

### OpenSpec Workflow
- `/opsx:explore` — Investigate ideas, clarify requirements (read-only)
- `/opsx:propose` — Create change proposals with design, specs, tasks
- `/opsx:apply` — Implement tasks from a change
- `/opsx:archive` — Archive completed changes
