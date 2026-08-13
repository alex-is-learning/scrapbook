#!/usr/bin/env bash
set -euo pipefail

ROOT=$(git rev-parse --show-toplevel)
cd "$ROOT"

# GUI apps (Obsidian) don't inherit the shell PATH, so homebrew's node isn't found
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

# Adds `date:` frontmatter to notes added in this commit, then re-stages them
node source/scripts/stamp-dates.mjs --staged
