# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Package Manager:** This project uses `pnpm` (not npm or yarn).

### Development
```bash
pnpm dev        # Start development server with hot reload (tsx watch)
pnpm start      # Start production server
```

Server runs on `http://localhost:3000`

### Code Quality
```bash
pnpm lint       # Check code with Biome
pnpm lint:fix   # Auto-fix lint issues
pnpm format     # Format code with Biome
```

## Architecture

### Core Technology Stack
- **Framework:** Hono with `OpenAPIHono` (not standard `Hono`)
- **Runtime:** Node.js with `@hono/node-server`
- **Validation:** Zod with `@hono/zod-openapi` for type-safe OpenAPI routes
- **Documentation:** `@hono/swagger-ui` for interactive API docs
- **JSX:** Hono's built-in JSX renderer (not React)

### Application Structure

This is a **monolithic single-file application** (`src/index.tsx`). All routes, middleware, and configuration live in one file.

**Key architectural decisions:**

1. **OpenAPIHono vs Hono:** The app uses `OpenAPIHono` instead of standard `Hono`, which enables:
   - Type-safe route definitions with `createRoute()`
   - Automatic OpenAPI schema generation
   - Zod validation integrated with OpenAPI specs

2. **Global JSX Renderer Middleware:** A single `jsxRenderer` middleware wraps ALL routes with a common HTML layout:
   ```tsx
   app.use('*', jsxRenderer(({ children }) => { ... }))
   ```
   Routes using `c.render()` will have their content injected into this layout.

3. **Route Patterns:**
   - Simple routes: `app.get('/path', (c) => c.json/html/text(...))`
   - OpenAPI routes: Define schema with `createRoute()`, then `app.openapi(route, handler)`

4. **Validation Error Handling:** Configured globally via `defaultHook` in OpenAPIHono constructor (see lines 6-19 in index.tsx)

### TSConfig Requirements

**Critical:** JSX configuration requires:
```json
{
  "jsx": "react-jsx",
  "jsxImportSource": "hono/jsx"
}
```
Without these, JSX will not compile. File must be `.tsx` not `.ts`.

### Biome Configuration

Code style is enforced by Biome (not ESLint/Prettier):
- 2-space indentation
- Single quotes
- Semicolons only when needed
- 100 character line width
- Auto-organize imports on save

HTML elements must include `lang` attribute (`<html lang="ja">`).

### API Documentation

- `/docs` - Swagger UI (interactive API testing)
- `/doc` - Raw OpenAPI JSON schema

Both are automatically generated from Zod schemas defined in `createRoute()` calls.
