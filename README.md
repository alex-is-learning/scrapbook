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

## Locked notes (password-protected)

This repo is public, so a note is protected by encryption, not by hiding it.

- **Lock a note:** name it `X.locked.md`. Git ignores `*.locked.md`, so the text never reaches GitHub.
- **What gets published:** the pre-commit hook runs `source/scripts/lock-notes.mjs`. It renders the note with Quartz on this machine, encrypts the result (AES-256-GCM, key from PBKDF2-SHA256, 600,000 rounds) and writes `X.md`, a stub that holds only ciphertext. The page shows a password box and decrypts in the browser (`source/quartz/components/scripts/lockednote.inline.ts`).
- **Password:** the first line of `~/.config/scrapbook/lock-password`. A note can set its own with `password: ...` in its frontmatter. A reader's browser remembers a password that worked.
- **Still public:** the file name, and the frontmatter keys `title`, `date`, `tags`, `aliases` (plus `locked: true`). Images that the note embeds are also public files. All notes on the default password open together, and an old ciphertext stays in git history after a password change.
- **Stale page:** a note is re-encrypted only when its own text changes. After a change to a linked note or to the theme, run `node source/scripts/lock-notes.mjs --force`.
- **Limits:** an unlocked page has no hover previews or copy buttons on code blocks.
- **Backup:** the stub holds the encrypted markdown too. `node source/scripts/lock-notes.mjs --restore` rebuilds each missing `X.locked.md` from its stub with the default password. Without the password, the text is gone, so keep the password in a password manager.
- **Unlock a note for good:** delete `X.md`, then rename `X.locked.md` back to `X.md`.
- **A note that was already committed in plain text stays readable in git history.** Locking protects new notes only.

## Scripts

- `scripts/update-wordcount.sh` — updates the word count displayed on the homepage
- `scripts/stamp-dates.sh` — adds `date:` frontmatter to notes added in the current commit (the Recent notes sidebar shows dated notes only)
- `scripts/install-git-hooks.sh` — installs git hooks (pre-commit: lock notes, PII guard, date stamp, word count)
- `source/scripts/stamp-dates.mjs` — the date stamper. `--staged` for the hook, no flag to backfill the current year's folder, `--all` for all of `content/`, `--dry-run` to preview. Date comes from a date in the filename, else the day the note is listed under in `Log per day - <year>.md`, else the day git first saw the file (today, for a new file).

## Gotcha: the Recent notes sidebar

`RecentNotes` in `source/quartz.layout.ts` filters and sorts on the `date:` frontmatter field **only** — Quartz's own created/modified dates are useless here, because CI clones the repo fresh and every file's filesystem date is the clone time. So **an undated note can never appear in the sidebar**, and it fails silently: the build stays green, the rest of the page keeps updating, and the sidebar just stops moving.

A bare `date:` with no value counts as undated too — it parses to null, which the filter drops exactly like a missing field. The stamper fills such a key in place rather than appending a second one.

Two things keep it honest: the `pre-commit` hook stamps notes as they are added, and the deploy job re-runs the stamper from git history before building, so a `--no-verify` commit cannot publish an undated note. `content/2025/` is deliberately left unstamped — its git history only records the bulk import, so any date it produced would be wrong.

Before believing the site is stale, read the word count on the home page. It changes on nearly every commit, so it dates the page you are looking at; GitHub Pages sends `max-age=600` and Quartz is an SPA, so a long-open tab can be many hours behind.
