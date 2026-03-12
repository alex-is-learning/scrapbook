#!/usr/bin/env node
/**
 * Counts words across all content .md files and updates the home page.
 *
 * Usage: node scripts/update-wordcount.mjs
 */

import fs from "fs"
import path from "path"

const CONTENT_DIR = path.join(import.meta.dirname, "../content")
const INDEX_FILE = path.join(CONTENT_DIR, "index.md")

const INFINITE_JEST = 577608
const ORDER_OF_PHOENIX = 257682

function countWords(str) {
  return str.trim().split(/\s+/).filter(Boolean).length
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

const total = walkDir(CONTENT_DIR).reduce((sum, f) => {
  return sum + countWords(fs.readFileSync(f, "utf-8"))
}, 0)

const ij = (total / INFINITE_JEST).toFixed(2)
const ootp = (total / ORDER_OF_PHOENIX).toFixed(2)
const formatted = total.toLocaleString("en-GB")

const newLine = `Hi, I'm Alex! This is my digital scrapbook - currently at ${formatted} words (AKA Infinite Jest x ${ij} or Order of the Phoenix x ${ootp}).`

const PATTERN = /Hi, I'm Alex! This is my digital scrapbook[^\n]*/

const index = fs.readFileSync(INDEX_FILE, "utf-8")

if (!PATTERN.test(index)) {
  console.log("Warning: pattern not found in index.md — nothing updated.")
  process.exit(1)
}

fs.writeFileSync(INDEX_FILE, index.replace(PATTERN, newLine), "utf-8")
console.log(`Updated: ${formatted} words (IJ × ${ij}, OotP × ${ootp})`)
