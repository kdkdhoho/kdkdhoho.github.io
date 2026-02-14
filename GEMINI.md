# Project Context: kdkdhoho.github.io

## Project Overview
This project is a personal technical blog built with **Gatsby**, hosted on GitHub Pages (`kdkdhoho.github.io`). It features technical content focused on Java, Spring Boot, Infrastructure, Flutter, and more, primarily in Korean.

## Key Technologies
-   **Framework:** Gatsby (React-based Static Site Generator)
-   **Language:** JavaScript (ES6+), Markdown
-   **Styling:** CSS (Custom Properties), Pretendard Font (`@fontsource/pretendard`)
-   **Data Source:** Markdown files via GraphQL
-   **Key Libraries:**
    -   `gatsby-transformer-remark`: Markdown parsing
    -   `gatsby-plugin-image`: Image optimization
    -   `prismjs`: Code block highlighting (`gatsby-remark-prismjs`)
    -   `gatsby-remark-autolink-headers`: Automatic header links for TOC
    -   `gatsby-remark-table-of-contents`: TOC generation

## Architecture

### File Structure
-   `content/blog/`: Contains blog posts in Markdown format. Organized by category (e.g., `java`, `spring`, `algorithm`).
    -   Each post is typically in `content/blog/category/post-name/index.md`.
    -   Images are co-located with the markdown file.
-   `src/`: Source code for the site.
    -   `components/`: Reusable UI components (`layout.js`, `bio.js`, `toc.js`, `seo.js`, `search.js`).
    -   `pages/`: Standard pages (`index.js`, `404.js`, `search.js`, `series.js`).
    -   `templates/`: Templates for generated pages (`blog-post.js`, `series.js`).
    -   `images/`: Static images (profile pics, etc.).
-   `gatsby-*.js`: Gatsby configuration files.
    -   `gatsby-node.js`: Handles dynamic page generation (posts and series).
    -   `gatsby-config.js`: Plugin configuration and site metadata.

### Page Generation
1.  **Blog Posts:** Generated from Markdown files in `content/blog`.
    -   Slug is generated from the file path.
    -   Drafts (`draft: true` in frontmatter) are excluded from the build.
2.  **Series Pages:**
    -   Individual series pages are generated from `src/templates/series.js`.
    -   Uses a custom mapping in `gatsby-node.js` to convert Korean series names to English slugs.
    -   Current mappings include:
        -   '링글 튜터링 복습' -> 'ringle-tutoring-review'
        -   '셀럽잇 프로젝트' -> 'celuveat-project'
        -   '그림으로 배우는 Http & Network Basic' -> 'http-network-basic'
        -   '창구 AI 스터디 잼' -> 'changgu-ai-study-jam'
        -   '운영체제 면접 스터디' -> 'os-interview-study'
        -   'Why? 시리즈' -> 'why-series'
        -   'DB 면접 스터디' -> 'db-interview-study'
        -   'Real MySQL 8.0' -> 'real-mysql-8'

## Development Conventions

### Content Authoring
-   **Frontmatter:**
    ```yaml
    ---
    title: Post Title
    date: "YYYY-MM-DD"
    description: Short summary
    tags: [Tag1, Tag2]
    series: Series Name (Optional)
    draft: false (Optional)
    ---
    ```
-   **Images:** Place images in the same directory as the markdown file and reference relatively.

### Commands
-   **Start Development Server:**
    ```bash
    npm run develop
    # or
    npm start
    ```
    Access at `http://localhost:8000`.
-   **Build for Production:**
    ```bash
    npm run build
    ```
-   **Serve Production Build:**
    ```bash
    npm run serve
    ```
-   **Clean Cache:**
    ```bash
    npm run clean
    ```
-   **Format Code:**
    ```bash
    npm run format
    ```
    Uses Prettier.

### Configuration Nuances
-   **TOC:** `gatsby-remark-table-of-contents` is configured for max depth 4.
-   **RSS:** Automatically generates an RSS feed at `/rss.xml` using `gatsby-plugin-feed`.
-   **Search:** A search feature is implemented using `src/pages/search.js` and `src/components/search.js`.
    -   **Z-Index Fix:** The search dropdown and header have high z-index values (1000 and 100 respectively) to ensure they are not covered by other components like post cards or series cards.
-   **Styling:**
    -   Bold text (`**`) in blog posts (`.blog-post-content strong`) is styled with a yellow highlighter effect.
-   **Series Slugs:** If adding a new Korean series name, update the mapping in the `createSlug` function. **Note:** This function is currently duplicated in `gatsby-node.js` and `src/pages/series.js` and should be updated in both places.

## Deployment
The site is hosted on GitHub Pages. Committing to the main branch triggers the GitHub Actions workflow (`.github/workflows/deploy.yml`) to build and deploy the site using `gatsby build`.