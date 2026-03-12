#!/usr/bin/env node
/**
 * Finds files tagged with "*/merge me" and replaces the sub-tag
 * with just the parent. E.g. "creative/merge me" → "creative".
 *
 * Usage: node scripts/merge-tags.mjs [--dry-run]
 */

import fs from "fs"
import path from "path"

const DRY_RUN = process.argv.includes("--dry-run")
const CONTENT_DIR = path.join(import.meta.dirname, "../content")

function walkDir(dir) {
  const files = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...walkDir(full))
    else if (entry.isFile() && entry.name.endsWith(".md")) files.push(full)
  }
  return files
}

let updated = 0

for (const filePath of walkDir(CONTENT_DIR)) {
  const raw = fs.readFileSync(filePath, "utf-8")

  // Only touch files that have a "*/merge me" tag
  if (!raw.includes("/merge me")) continue

  // Replace each "  - parent/merge me" line with "  - parent"
  const newContent = raw.replace(
    /^([ \t]+-[ \t]+)([\w-]+)\/merge me[ \t]*$/gm,
    "$1$2",
  )

  if (newContent === raw) continue

  const relative = filePath.replace(CONTENT_DIR, "")
  if (DRY_RUN) {
    // Show which tags are being merged
    const merged = [...raw.matchAll(/^[ \t]+-[ \t]+([\w-]+)\/merge me/gm)]
      .map(m => `${m[1]}/merge me → ${m[1]}`)
    console.log(`${relative}\n  ${merged.join("\n  ")}`)
  } else {
    fs.writeFileSync(filePath, newContent, "utf-8")
    updated++
  }
}

if (DRY_RUN) {
  console.log("\n[dry-run] No files changed.")
} else {
  console.log(`Done. Updated ${updated} file${updated !== 1 ? "s" : ""}.`)
}
