#!/usr/bin/env node
/**
 * Puts `date: YYYY-MM-DD` frontmatter on notes that have none.
 * The Recent notes sidebar filters and sorts on this field only,
 * so an undated note never appears there.
 *
 * Date source, first match wins:
 *   1. a YYYY-MM-DD date inside the filename
 *   2. the day the note is listed under in "Log per day - <year>.md"
 *   3. the day git first saw the file (backfill), or today (--staged)
 *
 * Usage:
 *   node source/scripts/stamp-dates.mjs --staged    # new files in this commit
 *   node source/scripts/stamp-dates.mjs             # backfill content/2026
 *   node source/scripts/stamp-dates.mjs --all       # backfill all of content/
 *   node source/scripts/stamp-dates.mjs --dry-run
 */

import fs from "fs"
import path from "path"
import { execFileSync } from "child_process"

const args = process.argv.slice(2)
const STAGED = args.includes("--staged")
const ALL = args.includes("--all")
const DRY_RUN = args.includes("--dry-run")

const SOURCE_DIR = path.join(import.meta.dirname, "..")
const CONTENT_DIR = path.join(SOURCE_DIR, "content")
const REPO_ROOT = path.join(SOURCE_DIR, "..")
const SKIP = new Set([path.join(CONTENT_DIR, "index.md")])

const git = (...a) =>
  execFileSync("git", a, { cwd: REPO_ROOT, encoding: "utf-8", maxBuffer: 32 * 1024 * 1024 })

const today = () => new Date().toISOString().slice(0, 10)

// title → first date it is logged under, across every "Log per day - <year>.md"
function buildLogMap() {
  const map = {}
  const logs = fs
    .readdirSync(CONTENT_DIR, { recursive: true })
    .filter((f) => /Log per day - \d{4}\.md$/.test(String(f)))
  for (const log of logs) {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, String(log)), "utf-8")
    let currentDate = null
    for (const line of raw.split("\n")) {
      const dateMatch = line.match(/^-\s+(\d{4}-\d{2}-\d{2})\s*$/)
      if (dateMatch) {
        currentDate = dateMatch[1]
        continue
      }
      if (!currentDate) continue
      const linkMatch = line.match(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/)
      if (linkMatch) {
        const title = linkMatch[1].trim()
        if (!map[title]) map[title] = currentDate
      }
    }
  }
  return map
}

// A bare `date:` with no value parses to null, which the sidebar filters out
// exactly like a missing field, so it does not count as dated.
const EMPTY_DATE = /^date:[ \t]*$/m

function hasDate(raw) {
  if (!raw.startsWith("---")) return false
  const end = raw.indexOf("\n---", 3)
  if (end === -1) return false
  const fm = raw.slice(4, end)
  return /^date:/m.test(fm) && !EMPTY_DATE.test(fm)
}

function injectDate(raw, dateStr) {
  if (!raw.startsWith("---")) return `---\ndate: ${dateStr}\n---\n${raw}`
  const end = raw.indexOf("\n---", 3)
  if (end === -1) return `---\ndate: ${dateStr}\n---\n${raw}`
  const fm = raw.slice(4, end)
  if (EMPTY_DATE.test(fm)) {
    return `---\n${fm.replace(EMPTY_DATE, `date: ${dateStr}`)}${raw.slice(end)}`
  }
  return `---\n${fm}\ndate: ${dateStr}${raw.slice(end)}`
}

// macOS is case-insensitive, so a file on disk can differ in case from the path
// git tracks. git log against the disk spelling then finds nothing.
let trackedByLower = null
function gitPath(file) {
  const rel = path.relative(REPO_ROOT, file)
  if (!trackedByLower) {
    trackedByLower = new Map(
      git("ls-files", "-z")
        .split("\0")
        .filter(Boolean)
        .map((p) => [p.toLowerCase(), p]),
    )
  }
  return trackedByLower.get(rel.toLowerCase()) ?? rel
}

function gitAddDate(file) {
  const out = git(
    "log", "--diff-filter=A", "--format=%ad", "--date=short", "-1", "--", gitPath(file),
  ).trim()
  return out.split("\n").pop() || null
}

function walk(dir) {
  const files = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...walk(full))
    else if (entry.isFile() && entry.name.endsWith(".md")) files.push(full)
  }
  return files
}

function targets() {
  if (STAGED) {
    return git("diff", "--cached", "--name-only", "--diff-filter=A", "-z")
      .split("\0")
      .filter((f) => f.endsWith(".md") && f.startsWith("source/content/"))
      .map((f) => path.join(REPO_ROOT, f))
      .filter((f) => fs.existsSync(f))
  }
  // The archive folders were written before this script existed and their git
  // history only records the import, so only the current year is backfilled.
  if (ALL) return walk(CONTENT_DIR)
  const currentYear = path.join(CONTENT_DIR, String(new Date().getFullYear()))
  return fs.existsSync(currentYear) ? walk(currentYear) : []
}

const logMap = buildLogMap()
let stamped = 0

for (const file of targets()) {
  if (SKIP.has(file)) continue
  const raw = fs.readFileSync(file, "utf-8")
  if (hasDate(raw)) continue

  const name = path.basename(file, ".md")
  const date =
    name.match(/(\d{4}-\d{2}-\d{2})/)?.[1] ??
    logMap[name] ??
    (STAGED ? today() : gitAddDate(file)) ??
    today()

  if (DRY_RUN) {
    console.log(`[dry-run] ${name}  →  date: ${date}`)
    stamped++
    continue
  }

  fs.writeFileSync(file, injectDate(raw, date), "utf-8")
  if (STAGED) git("add", "--", path.relative(REPO_ROOT, file))
  stamped++
}

console.log(`stamp-dates: ${stamped} note(s) stamped${DRY_RUN ? " (dry run)" : ""}.`)
