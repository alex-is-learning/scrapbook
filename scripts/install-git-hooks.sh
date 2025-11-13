#!/usr/bin/env bash
set -euo pipefail

# Installer for local git hooks.
# Copies files from scripts/hooks/ into .git/hooks/ and makes them executable.

ROOT=$(git rev-parse --show-toplevel 2>/dev/null || true)
if [ -z "$ROOT" ]; then
  echo "Error: not inside a git repository."
  exit 1
fi

HOOKS_DIR="$ROOT/.git/hooks"
SRC_DIR="$ROOT/scripts/hooks"

if [ ! -d "$SRC_DIR" ]; then
  echo "Error: hooks source directory '$SRC_DIR' not found." >&2
  exit 1
fi

for hook in "$SRC_DIR"/*; do
  if [ -f "$hook" ]; then
    name=$(basename "$hook")
    dest="$HOOKS_DIR/$name"
    echo "Installing hook $name -> $dest"
    cp "$hook" "$dest"
    chmod +x "$dest"
  fi
done

echo "Installed hooks. You can now commit and the pre-commit hook will run the wordcount update."

exit 0
