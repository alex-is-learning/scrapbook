> README written by Claude (claude-sonnet-4-6) on 2026-04-02

# Alex's Scrapbook

A personal digital scrapbook/notebook/garden — live at **https://alexanderlarge.com/scrapbook** (reverse-proxied there via the alexanderlarge.com Next.js site; this repo still deploys to GitHub Pages at alexislearning.me/scrapbook, which old links auto-forward from — see the redirect script in `quartz/components/Head.tsx`)

## What it is

A collection of notes, essays, and learning logs covering topics like epistemology, meditation, schema therapy, post-rationalism, and creative work. Currently ~374k words and growing.

## How it's built

- **[Quartz v4](https://quartz.jzhao.xyz/)** — static site generator built for digital gardens, converts Obsidian markdown to a website
- **[Obsidian](https://obsidian.md/)** — used locally for writing and editing notes
- **GitHub Pages** — hosting, with automatic deploys via GitHub Actions on every push to `main`
- **[GoatCounter](https://www.goatcounter.com/)** — privacy-first, cookieless visitor analytics

The content lives in `source/content/` as plain markdown files. Quartz builds them into a static site in `source/public/`.

## Local development

```bash
cd source
npm install
npx quartz build --serve
```

## Scripts

- `scripts/update-wordcount.sh` — updates the word count displayed on the homepage
- `scripts/stamp-dates.sh` — adds `date:` frontmatter to notes added in the current commit (the Recent notes sidebar shows dated notes only)
- `scripts/install-git-hooks.sh` — installs git hooks (pre-commit: PII guard, date stamp, word count)
- `source/scripts/stamp-dates.mjs` — the date stamper. `--staged` for the hook, no flag to backfill `content/2026`, `--all` for all of `content/`, `--dry-run` to preview. Date comes from a date in the filename, else the day the note is listed under in `Log per day - <year>.md`, else the day git first saw the file (today, for a new file).
