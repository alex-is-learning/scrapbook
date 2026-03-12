#!/usr/bin/env node
/**
 * Rewrites Topic hub pages so links are grouped by YYYY-MM, newest first.
 *
 * Date resolution priority per linked file:
 *   1. frontmatter `date:` field
 *   2. YYYY-MM-DD pattern in filename
 *   3. filesystem birthtime
 *
 * Usage: node scripts/sort-topic-pages.mjs [--dry-run]
 */

import fs from "fs"
import path from "path"

const DRY_RUN = process.argv.includes("--dry-run")
const CONTENT_DIR = path.join(import.meta.dirname, "../content")
const TOPICS_DIR = path.join(CONTENT_DIR, "Topics")

// ── Build filename → { path, date } index ──────────────────────────────────

function extractFrontmatterDate(raw) {
  if (!raw.startsWith("---")) return null
  const end = raw.indexOf("\n---", 3)
  if (end === -1) return null
  const yaml = raw.slice(4, end)
  const m = yaml.match(/^date:\s*(\d{4}-\d{2}-\d{2})/m)
  return m ? new Date(m[1]) : null
}

function extractFilenameDate(filename) {
  const m = filename.match(/(\d{4}-\d{2}-\d{2})/)
  return m ? new Date(m[1]) : null
}

function walkDir(dir) {
  const files = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...walkDir(full))
    else if (entry.isFile() && entry.name.endsWith(".md")) files.push(full)
  }
  return files
}

// Map: lowercase filename (without .md) → { filePath, date }
const fileIndex = new Map()
for (const filePath of walkDir(CONTENT_DIR)) {
  const filename = path.basename(filePath, ".md")
  const raw = fs.readFileSync(filePath, "utf-8")
  const date =
    extractFrontmatterDate(raw) ??
    extractFilenameDate(filename) ??
    new Date(fs.statSync(filePath).birthtimeMs)
  fileIndex.set(filename.toLowerCase(), { filePath, date })
}

// ── Parse & rewrite each topic page ────────────────────────────────────────

// Extract the wiki-link title from a line: "- [[Title]]" or "- [[Title|alias]] extra"
function extractWikiTitle(line) {
  const m = line.match(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/)
  return m ? m[1].trim() : null
}

function getDateForLink(title) {
  return fileIndex.get(title.toLowerCase())?.date ?? null
}

function toYYYYMM(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
}

function rewriteTopicPage(filePath) {
  const raw = fs.readFileSync(filePath, "utf-8")

  // Split frontmatter from body
  let frontmatter = ""
  let body = raw
  if (raw.startsWith("---")) {
    const end = raw.indexOf("\n---", 3)
    if (end !== -1) {
      frontmatter = raw.slice(0, end + 4) // includes closing ---
      body = raw.slice(end + 4).replace(/^\n/, "")
    }
  }

  // Split body into: intro lines, content lines, related lines
  const lines = body.split("\n")
  const introLines = []
  const contentLines = []
  const relatedLines = []
  let inRelated = false
  let pastIntro = false

  for (const line of lines) {
    if (line.startsWith("## Related")) {
      inRelated = true
    }
    if (inRelated) {
      relatedLines.push(line)
      continue
    }
    if (line.startsWith("##")) {
      pastIntro = true
    }
    if (!pastIntro) {
      introLines.push(line)
    } else {
      contentLines.push(line)
    }
  }

  // Collect bullet lines and their dates (skip non-bullet lines and ## headers)
  const dated = []   // { line, date, yyyymm }
  const undated = [] // lines with wiki-links but no resolvable date
  const other = []   // external links or annotation-only lines

  for (const line of contentLines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    // Only process list items
    if (!trimmed.startsWith("- ")) continue

    const title = extractWikiTitle(line)
    if (!title) {
      // External markdown link (e.g. [text](url))
      if (/^\s*-\s+\[/.test(line)) other.push(line)
      continue
    }

    const date = getDateForLink(title)
    if (date) {
      dated.push({ line: line.trim().replace(/^-\s*/, "").trimEnd(), date, yyyymm: toYYYYMM(date) })
    } else {
      undated.push(line.trim().replace(/^-\s*/, "").trimEnd())
    }
  }

  // Sort dated entries newest first
  dated.sort((a, b) => b.date - a.date)

  // Group by YYYY-MM
  const groups = new Map()
  for (const entry of dated) {
    if (!groups.has(entry.yyyymm)) groups.set(entry.yyyymm, [])
    groups.get(entry.yyyymm).push(entry.line)
  }

  // Build output
  const out = []
  out.push(frontmatter)
  out.push("")

  // Intro paragraph (trim trailing blank lines)
  const trimmedIntro = introLines.join("\n").trimEnd()
  if (trimmedIntro) {
    out.push(trimmedIntro)
    out.push("")
  }

  // Date-grouped sections
  for (const [yyyymm, items] of groups) {
    out.push(`## ${yyyymm}`)
    out.push("")
    for (const item of items) out.push(`- ${item}`)
    out.push("")
  }

  // Undated links (concept notes with no date signal)
  if (undated.length > 0) {
    out.push("## Undated")
    out.push("")
    for (const item of undated) out.push(`- ${item}`)
    out.push("")
  }

  // External / other links
  if (other.length > 0) {
    out.push("## External")
    out.push("")
    for (const item of other) out.push(item)
    out.push("")
  }

  // Related section
  if (relatedLines.length > 0) {
    out.push(relatedLines.join("\n").trimEnd())
    out.push("")
  }

  return out.join("\n").trimEnd() + "\n"
}

const topicFiles = fs
  .readdirSync(TOPICS_DIR)
  .filter((f) => f.endsWith(".md"))
  .map((f) => path.join(TOPICS_DIR, f))

for (const filePath of topicFiles) {
  const result = rewriteTopicPage(filePath)
  const name = path.basename(filePath)

  if (DRY_RUN) {
    console.log(`\n${"=".repeat(60)}\n${name}\n${"=".repeat(60)}`)
    console.log(result)
  } else {
    fs.writeFileSync(filePath, result, "utf-8")
    console.log(`Rewrote: ${name}`)
  }
}
