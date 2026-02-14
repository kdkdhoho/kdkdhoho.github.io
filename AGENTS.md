# Repository Guidelines

## Project Structure & Module Organization
- `content/blog/`: Markdown posts organized by category, e.g. `content/blog/Java/what-is-jdbc/index.md`. Images live alongside the post.
- `src/components/`: Reusable UI (layout, bio, TOC, SEO, search).
- `src/pages/`: Top-level pages (`index.js`, `404.js`, `search.js`, `series.js`).
- `src/templates/`: Gatsby page templates (blog posts, series pages).
- `static/`: Static assets copied as-is.
- `public/`: Build output (generated).
- `gatsby-*.js`: Gatsby config and build hooks.

## Build, Test, and Development Commands
- `npm run develop`: Start the local dev server at `http://localhost:8000`.
- `npm run build`: Production build (Gatsby).
- `npm run serve`: Serve the production build locally.
- `npm run clean`: Clear Gatsby caches.
- `npm run format`: Run Prettier on JS/TS/JSON/MD.
- `npm test`: Currently exits with a “Write tests!” message (no automated suite yet).

## Coding Style & Naming Conventions
- JavaScript/Markdown are formatted with Prettier; config is in `.prettierrc` (no semicolons, `arrowParens: avoid`).
- Prefer consistent post slugs and directory names: `content/blog/<Category>/<post-slug>/index.md`.
- Frontmatter format (required):
  ```yaml
  ---
  title: "..."
  date: "YYYY-MM-DD"
  description: "..."
  tags: [tag1, tag2]
  ---
  ```

## Testing Guidelines
- No test framework is wired in this repo yet. Keep changes small and validate by running `npm run develop` or `npm run build`.

## Commit & Pull Request Guidelines
- Commit history uses conventional prefixes like `docs: ...` with concise, often Korean descriptions. Follow that pattern (e.g., `docs: Spring Boot 포스트 추가`).
- For PRs, include: summary of content changes, affected paths (e.g., `content/blog/...`), and screenshots if UI/layout changes are involved.

## Deployment
- Pushes to `main` trigger GitHub Actions (`.github/workflows/deploy.yml`) to run `gatsby build --prefix-paths` and publish `public/` to GitHub Pages.

## Agent Notes
- Additional project context for AI assistants lives in `CLAUDE.md` and `GEMINI.md`.
