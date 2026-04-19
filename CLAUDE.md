# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This repository is a VitePress documentation site for personal technical notes. It is content-first rather than application-first: most work happens in Markdown files under topic folders at the repository root, while site behavior and navigation are configured in `.vitepress/config.mts`.

## Common commands

- Install dependencies: `npm ci`
- Start the local dev server: `npm run docs:dev`
- Build the production site: `npm run docs:build`
- Preview the production build: `npm run docs:preview`

The dev server is configured in `.vitepress/config.mts` to listen on `0.0.0.0:9527`.

There is currently no lint script and no test runner configured in `package.json`, so there is no single-test command for this repository.

## Architecture

### Site configuration

- `.vitepress/config.mts` is the authoritative site map.
- It defines global site metadata, local search, nav, all sidebar sections, sitemap settings, `lastUpdated`, outline levels, and the dev server settings.
- Route prefixes are tied directly to the root-level content folders, such as `/PostgreSQL/`, `/Interview/`, `/Frontend/`, and `/Claude/`.

### Content structure

- The homepage content lives in `index.md`.
- Topic content lives in root-level directories such as `PostgreSQL/`, `Interview/`, `SortAlgorithm/`, `VPS/`, `Git/`, `Frontend/`, `Golang/`, `Claude/`, `ElasticSearch/`, and `UniApp/`.
- These folder names are part of the public URL structure, so renaming them changes routes.

### Theme layer

- `.vitepress/theme/index.ts` only extends the default VitePress theme and imports `.vitepress/theme/custom.css`.
- Theme customization is CSS-first; there are no custom Vue theme components at the moment.
- `.vitepress/theme/custom.css` adjusts typography, content width, and code/table/list styling globally.

### Deployment

- GitHub Pages deployment is defined in `.github/workflows/deploy.yml`.
- Deploys run on pushes to `master`.
- The site is built with `npm run docs:build` and published from `.vitepress/dist`.
- The workflow uses `fetch-depth: 0`, which matters because `lastUpdated: true` is enabled in `.vitepress/config.mts`.

## Working conventions

- Navigation is manually curated. Adding a new Markdown page does not automatically expose it in the UI.
- When adding or publishing a page, update the relevant topic folder content and the sidebar in `.vitepress/config.mts`.
- If the page should be highlighted from the homepage, also update `index.md`.
- Homepage feature links and sidebar entries are maintained separately, so keep them in sync manually.
- Some content may exist on disk but remain intentionally hidden from navigation. For example, `UniApp/` content is present, while its homepage/sidebar entries are commented out.

## Files to treat as generated or dependency-managed

- Do not edit `node_modules/`.
- Do not manually edit `.vitepress/cache/`; it is generated cache data.
