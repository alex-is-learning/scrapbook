#!/usr/bin/env node
/**
 * Bulk tag content files based on folder path and filename keywords.
 * Adds tags to frontmatter without overwriting existing tags.
 *
 * Usage: node scripts/add-tags.mjs [--dry-run]
 */

import fs from "fs"
import path from "path"

const DRY_RUN = process.argv.includes("--dry-run")
const CONTENT_DIR = path.join(import.meta.dirname, "../content")

// Maps path fragments to tags to apply (all matching rules contribute)
const PATH_RULES = [
  { match: /\/1\. creating things\/writings\//i, tags: ["writing"] },
  { match: /\/1\. creating things\/music/i, tags: ["music", "creative"] },
  { match: /\/1\. creating things\//i, tags: ["creative"] },
  { match: /\/2\. connecting with people\//i, tags: ["community", "relationships"] },
  { match: /\/3\. improving lived experience\/1\. healing\/meditation/i, tags: ["meditation", "contemplative-practice"] },
  { match: /\/3\. improving lived experience\/1\. healing\//i, tags: ["healing", "personal-growth"] },
  { match: /\/3\. improving lived experience\/fitness/i, tags: ["fitness", "personal-growth"] },
  { match: /\/3\. improving lived experience\/family/i, tags: ["personal-growth", "personal-history"] },
  { match: /\/3\. improving lived experience\/making money/i, tags: ["thinking"] },
  { match: /\/3\. improving lived experience\/consensus-ism/i, tags: ["consensus-ism"] },
  { match: /\/3\. improving lived experience\//i, tags: ["personal-growth"] },
  { match: /\/4\. thinking\/how to learn/i, tags: ["thinking", "learning"] },
  { match: /\/4\. thinking\/ori/i, tags: ["ori", "post-rationalism"] },
  { match: /\/4\. thinking\//i, tags: ["thinking", "epistemology"] },
  { match: /\/5\. alex anthropology\/my eras/i, tags: ["personal-history"] },
  { match: /\/5\. alex anthropology\/art/i, tags: ["creative", "personal-history"] },
  { match: /\/5\. alex anthropology\//i, tags: ["personal-history"] },
  { match: /\/consensus-ism website\//i, tags: ["consensus-ism"] },
]

const FILENAME_RULES = [
  { match: /meditation|jhana|sit \d+|mctb|concentration|contemplat/i, tags: ["meditation", "contemplative-practice"] },
  { match: /healing|trauma|therapy|adoption|family systems/i, tags: ["healing", "personal-growth"] },
  { match: /\bori\b|post.ration|socratic|epistem|how to (learn|think)/i, tags: ["ori", "post-rationalism"] },
  { match: /consensus.ism/i, tags: ["consensus-ism"] },
  { match: /vignette|writing|poem|essay/i, tags: ["writing", "creative"] },
  { match: /music|song|\bdj\b|playlist/i, tags: ["music", "creative"] },
  { match: /\bera\b|personal history|mytho/i, tags: ["personal-history"] },
  { match: /fitness|workout|exercise|running/i, tags: ["fitness", "personal-growth"] },
  { match: /community|connection|coach|relating/i, tags: ["community", "relationships"] },
]

function getTagsForFile(filePath) {
  const relative = filePath.replace(CONTENT_DIR, "").replace(/\\/g, "/")
  const filename = path.basename(filePath, ".md")
  const tags = new Set()

  for (const rule of PATH_RULES) {
    if (rule.match.test(relative)) rule.tags.forEach((t) => tags.add(t))
  }
  for (const rule of FILENAME_RULES) {
    if (rule.match.test(filename)) rule.tags.forEach((t) => tags.add(t))
  }

  return [...tags]
}

// Minimal frontmatter parser — handles YAML block at start of file
function parseFrontmatter(raw) {
  if (!raw.startsWith("---")) return { data: {}, content: raw, hasFrontmatter: false }

  const end = raw.indexOf("\n---", 3)
  if (end === -1) return { data: {}, content: raw, hasFrontmatter: false }

  const yaml = raw.slice(4, end) // between first --- and second ---
  const content = raw.slice(end + 4) // after closing ---

  // Parse existing tags from YAML
  const data = {}
  const tagsMatch = yaml.match(/^tags:\s*\n((?:[ \t]+-[^\n]*\n?)*)/m)
  if (tagsMatch) {
    data.tags = tagsMatch[1]
      .split("\n")
      .map((line) => line.replace(/^\s*-\s*/, "").trim())
      .filter(Boolean)
  }
  const inlineTagsMatch = yaml.match(/^tags:\s*\[([^\]]*)\]/m)
  if (inlineTagsMatch) {
    data.tags = inlineTagsMatch[1]
      .split(",")
      .map((t) => t.trim().replace(/^['"]|['"]$/g, ""))
      .filter(Boolean)
  }

  return { data, yaml, content, hasFrontmatter: true, end }
}

function injectTags(raw, newTags) {
  if (!raw.startsWith("---")) {
    // No frontmatter — prepend it
    const tagLines = newTags.map((t) => `  - ${t}`).join("\n")
    return `---\ntags:\n${tagLines}\n---\n${raw}`
  }

  const end = raw.indexOf("\n---", 3)
  if (end === -1) return raw // malformed, leave alone

  const yamlBlock = raw.slice(4, end)
  const rest = raw.slice(end)

  // If tags key already exists, replace it
  const tagLines = newTags.map((t) => `  - ${t}`).join("\n")
  if (/^tags:/m.test(yamlBlock)) {
    // Replace existing tags block (list or inline)
    const updated = yamlBlock
      .replace(/^tags:\s*\[[^\]]*\]/m, `tags:\n${tagLines}`)
      .replace(/^tags:\s*\n((?:[ \t]+-[^\n]*\n?)*)*/m, `tags:\n${tagLines}\n`)
    return `---\n${updated}${rest}`
  }

  // Add tags before closing ---
  return `---\n${yamlBlock}\ntags:\n${tagLines}${rest}`
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...walkDir(full))
    else if (entry.isFile() && entry.name.endsWith(".md")) files.push(full)
  }
  return files
}

let updated = 0
let unchanged = 0
let dryRun = 0

const files = walkDir(CONTENT_DIR)

for (const filePath of files) {
  const raw = fs.readFileSync(filePath, "utf-8")
  const { data } = parseFrontmatter(raw)

  const newTags = getTagsForFile(filePath)
  if (newTags.length === 0) { unchanged++; continue }

  const existingTags = new Set(data.tags ?? [])
  const merged = [...new Set([...existingTags, ...newTags])]

  if (merged.length === existingTags.size && merged.every((t) => existingTags.has(t))) {
    unchanged++
    continue
  }

  const relative = filePath.replace(CONTENT_DIR, "")
  if (DRY_RUN) {
    console.log(`${relative}`)
    console.log(`  + ${merged.filter((t) => !existingTags.has(t)).join(", ")}`)
    dryRun++
    continue
  }

  const updated_content = injectTags(raw, merged)
  fs.writeFileSync(filePath, updated_content, "utf-8")
  updated++
}

if (DRY_RUN) {
  console.log(`\n[dry-run] Would update ${dryRun} files. ${unchanged} already up-to-date.`)
  console.log(`Total scanned: ${files.length}`)
} else {
  console.log(`\nDone. Updated: ${updated}, Unchanged: ${unchanged}`)
  console.log(`Total scanned: ${files.length}`)
}
