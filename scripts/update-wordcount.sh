#!/usr/bin/env bash
set -euo pipefail

ROOT=$(git rev-parse --show-toplevel)
cd "$ROOT"

node source/scripts/update-wordcount.mjs

git add -- source/content/index.md
echo "Staged source/content/index.md for commit."
