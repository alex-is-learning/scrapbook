#!/usr/bin/env node
/**
 * Reads "Log per day - 2026.md" and injects `date:` frontmatter into
 * each linked file based on the date it was logged.
 *
 * Usage: node scripts/date-from-log.mjs [--dry-run]
 */

import fs from "fs"
import path from "path"

const DRY_RUN = process.argv.includes("--dry-run")
const CONTENT_DIR = path.join(import.meta.dirname, "../content")
const LOG_FILE = path.join(CONTENT_DIR, "2026/Log per day - 2026.md")

// Parse the log file: extract date → [page titles] mappings
function parseLog(logPath) {
  const raw = fs.readFileSync(logPath, "utf-8")
  const map = {} // title → ISO date string
  let currentDate = null

  for (const line of raw.split("\n")) {
    // Date line: "- 2026-03-12"
    const dateMatch = line.match(/^-\s+(\d{4}-\d{2}-\d{2})\s*$/)
    if (dateMatch) {
      currentDate = dateMatch[1]
      continue
    }
    // Wiki-link line: "\t- [[Page Name]]" or "\t- [[Page Name|alias]]"
    if (currentDate) {
      const linkMatch = line.match(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/)
      if (linkMatch) {
        const title = linkMatch[1].trim()
        if (!map[title]) map[title] = currentDate // first occurrence wins
      }
    }
  }
  return map
}

// Walk content/2026/ for .md files
function walkDir(dir) {
  const files = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...walkDir(full))
    else if (entry.isFile() && entry.name.endsWith(".md")) files.push(full)
  }
  return files
}

function injectDate(raw, dateStr) {
  if (!raw.startsWith("---")) {
    return `---\ndate: ${dateStr}\n---\n${raw}`
  }
  const end = raw.indexOf("\n---", 3)
  if (end === -1) return raw

  const yaml = raw.slice(4, end)
  const rest = raw.slice(end)

  // Already has date, skip
  if (/^date:/m.test(yaml)) return null

  return `---\n${yaml}\ndate: ${dateStr}${rest}`
}

const titleToDate = parseLog(LOG_FILE)
const files = walkDir(path.join(CONTENT_DIR, "2026"))

let updated = 0
let skipped = 0

for (const filePath of files) {
  const filename = path.basename(filePath, ".md")
  const date = titleToDate[filename]
  if (!date) { skipped++; continue }

  const raw = fs.readFileSync(filePath, "utf-8")
  const newContent = injectDate(raw, date)

  if (!newContent) { skipped++; continue } // already has date

  if (DRY_RUN) {
    console.log(`[dry-run] ${filename}  →  date: ${date}`)
    updated++
    continue
  }

  fs.writeFileSync(filePath, newContent, "utf-8")
  updated++
}

console.log(`\nDone. Updated: ${updated}, Skipped: ${skipped}`)
