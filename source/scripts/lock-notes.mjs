#!/usr/bin/env node
/**
 * Password-protects notes on a public site built from a public repo.
 *
 * A note named `X.locked.md` is gitignored, so its text never reaches GitHub.
 * This script renders it with Quartz on this machine, encrypts the result, and
 * writes `X.md`: a stub that holds only ciphertext. The stub is what gets
 * committed and published. The browser decrypts it after the reader types the
 * password (quartz/components/scripts/lockednote.inline.ts).
 *
 * The stub also holds the encrypted markdown, so the repo is the backup of the
 * plaintext: `--restore` writes `X.locked.md` back from the stub.
 *
 * Usage:
 *   node scripts/lock-notes.mjs            encrypt every changed locked note
 *   node scripts/lock-notes.mjs --stage    same, then `git add` the stubs (pre-commit)
 *   node scripts/lock-notes.mjs --force    re-encrypt all, changed or not
 *   node scripts/lock-notes.mjs --restore  recreate missing X.locked.md files from stubs
 *
 * Password: `password:` in the note's frontmatter, else the first line of
 * ~/.config/scrapbook/lock-password.
 */

import fs from "fs"
import os from "os"
import path from "path"
import { execFileSync } from "child_process"
import { webcrypto } from "crypto"
import matter from "gray-matter"
import yaml from "js-yaml"

const SOURCE_DIR = path.join(import.meta.dirname, "..")
const CONTENT_DIR = path.join(SOURCE_DIR, "content")
const BUILD_DIR = path.join(SOURCE_DIR, "..", ".lock-build")
const PASSWORD_FILE = path.join(os.homedir(), ".config/scrapbook/lock-password")
const SUFFIX = ".locked.md"
const ITERATIONS = 600000
const PUBLIC_KEYS = new Set(["title", "date", "tags", "aliases"])

const args = new Set(process.argv.slice(2))
const { subtle } = webcrypto

function walk(dir, test, found = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, test, found)
    else if (entry.isFile() && test(entry.name)) found.push(full)
  }
  return found
}

// Throws on YAML it cannot parse, so a malformed note is never half-published.
function parseNote(text) {
  const { data, content } = matter(text.replace(/^\uFEFF/, ""))
  return { data, content }
}

function publicFrontmatter(data) {
  const kept = Object.fromEntries(Object.entries(data).filter(([key]) => PUBLIC_KEYS.has(key)))
  return yaml.dump({ ...kept, locked: true })
}

function defaultPassword() {
  if (!fs.existsSync(PASSWORD_FILE)) return null
  return fs.readFileSync(PASSWORD_FILE, "utf-8").split(/\r?\n/)[0].trim() || null
}

async function deriveKey(password, salt) {
  const material = await subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveKey"],
  )
  return subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  )
}

// Payload layout: salt (16 bytes) | iv (12 bytes) | AES-GCM ciphertext, as base64url.
async function encrypt(text, password) {
  const salt = webcrypto.getRandomValues(new Uint8Array(16))
  const iv = webcrypto.getRandomValues(new Uint8Array(12))
  const key = await deriveKey(password, salt)
  const data = await subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(text))
  return Buffer.concat([salt, iv, Buffer.from(data)]).toString("base64url")
}

async function decrypt(payload, password) {
  const bytes = Buffer.from(payload, "base64url")
  const key = await deriveKey(password, bytes.subarray(0, 16))
  try {
    const data = await subtle.decrypt(
      { name: "AES-GCM", iv: bytes.subarray(16, 28) },
      key,
      bytes.subarray(28),
    )
    return new TextDecoder().decode(data)
  } catch {
    return null
  }
}

function readStub(stubPath) {
  if (!fs.existsSync(stubPath)) return null
  const text = fs.readFileSync(stubPath, "utf-8")
  const payload = text.match(/data-payload="([A-Za-z0-9_-]+)"/)?.[1]
  let data = {}
  try {
    data = parseNote(text).data
  } catch {}
  return { isStub: data.locked === true && Boolean(payload), payload, data }
}

// Mirrors sluggify() in quartz/util/path.ts.
function slugFor(stubPath) {
  return path
    .relative(CONTENT_DIR, stubPath)
    .replace(/\.md$/, "")
    .split(path.sep)
    .map((segment) =>
      segment
        .replace(/\s/g, "-")
        .replace(/&/g, "-and-")
        .replace(/%/g, "-percent")
        .replace(/\?/g, "")
        .replace(/#/g, ""),
    )
    .join("/")
    .replace(/_index$/, "index")
}

async function restore() {
  const stubs = walk(CONTENT_DIR, (name) => name.endsWith(".md") && !name.endsWith(SUFFIX))
  for (const stubPath of stubs) {
    const lockedPath = stubPath.replace(/\.md$/, SUFFIX)
    if (fs.existsSync(lockedPath)) continue
    const stub = readStub(stubPath)
    if (!stub?.isStub) continue
    const password = defaultPassword()
    const plain = password && (await decrypt(stub.payload, password))
    if (!plain) {
      console.error(`lock-notes: the default password does not open ${stubPath}`)
      continue
    }
    fs.writeFileSync(lockedPath, JSON.parse(plain).md)
    console.log(`Restored ${path.relative(CONTENT_DIR, lockedPath)}`)
  }
}

async function lock() {
  const pending = []
  for (const lockedPath of walk(CONTENT_DIR, (name) => name.endsWith(SUFFIX))) {
    const stubPath = lockedPath.slice(0, -SUFFIX.length) + ".md"
    const rel = path.relative(CONTENT_DIR, lockedPath)
    const md = fs.readFileSync(lockedPath, "utf-8")
    const { data, content } = parseNote(md)
    const password = data.password != null ? String(data.password) : defaultPassword()
    if (!password) throw new Error(`no password for ${rel}. Put one in ${PASSWORD_FILE}`)

    const stub = readStub(stubPath)
    if (stub && !stub.isStub) {
      throw new Error(`${path.relative(CONTENT_DIR, stubPath)} exists and is not a locked stub. Move it first.`)
    }
    if (stub && !args.has("--force")) {
      const current = await decrypt(stub.payload, password)
      if (current && JSON.parse(current).md === md) continue
    }

    const { password: _, ...privateData } = data
    const publicData = { ...data }
    if (publicData.date == null && stub?.data.date != null) publicData.date = stub.data.date
    pending.push({ stubPath, rel, md, password, publicData, clonePage: matter.stringify(content, privateData) })
  }

  if (pending.length === 0) return

  const cloneDir = path.join(BUILD_DIR, "content")
  const outDir = path.join(BUILD_DIR, "out")
  const staged = []
  // One build per password: a note that embeds another locked note must not
  // carry text that its own password is not meant to open.
  for (const password of new Set(pending.map((note) => note.password))) {
    const group = pending.filter((note) => note.password === password)
    fs.rmSync(BUILD_DIR, { recursive: true, force: true })
    fs.cpSync(CONTENT_DIR, cloneDir, { recursive: true, mode: fs.constants.COPYFILE_FICLONE })
    for (const note of group) {
      fs.writeFileSync(path.join(cloneDir, path.relative(CONTENT_DIR, note.stubPath)), note.clonePage)
    }
    execFileSync(
      process.execPath,
      ["quartz/bootstrap-cli.mjs", "build", "-d", cloneDir, "-o", outDir],
      { cwd: SOURCE_DIR, stdio: ["ignore", "ignore", "inherit"] },
    )
    for (const note of group) {
      const page = fs.readFileSync(path.join(outDir, `${slugFor(note.stubPath)}.html`), "utf-8")
      const html = page.match(/<article[^>]*>([\s\S]*)<\/article>/)?.[1]
      if (html === undefined) throw new Error(`Quartz output for ${note.rel} has no <article>`)
      const payload = await encrypt(JSON.stringify({ md: note.md, html }), password)
      fs.writeFileSync(
        note.stubPath,
        `---\n${publicFrontmatter(note.publicData)}---\n\n` +
          `<div class="locked-note" data-payload="${payload}"></div>\n`,
      )
      staged.push(note.stubPath)
      console.log(`Locked ${note.rel}`)
    }
  }
  if (args.has("--stage")) execFileSync("git", ["add", "--", ...staged], { cwd: SOURCE_DIR })
}

const cleanup = () => fs.rmSync(BUILD_DIR, { recursive: true, force: true })
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    cleanup()
    process.exit(1)
  })
}

try {
  await (args.has("--restore") ? restore() : lock())
} catch (error) {
  console.error(`lock-notes: ${error.message}`)
  process.exitCode = 1
} finally {
  cleanup()
}
