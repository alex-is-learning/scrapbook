#!/usr/bin/env bash
# Blocks commits that would publish someone's contact details.
# This repo is PUBLIC — a private note drifting in here goes on the open web.
# Bypass with `git commit --no-verify` when a match is genuinely fine.
set -uo pipefail

ROOT=$(git rev-parse --show-toplevel)
cd "$ROOT"

# Alex's own addresses — publishing these is his call, not a leak.
OWN_EMAILS='alexanderklarge@gmail\.com|alexiscreatingthings@gmail\.com|alexander@alargecompany\.com|hello@alexanderlarge\.com'

# Vendored/third-party text is full of maintainer emails; not ours to police.
is_vendored() {
  case "$1" in
    source/node_modules/*|*/node_modules/*|source/public/static/*) return 0 ;;
    *CODE_OF_CONDUCT*|*LICENSE*|*SECURITY*) return 0 ;;
    *) return 1 ;;
  esac
}

fail=0
report() {
  if [ "$fail" -eq 0 ]; then
    echo ""
    echo "BLOCKED — this commit looks like it publishes contact details."
    echo "Repo is public. Check each hit below, then either edit it out or"
    echo "re-run with --no-verify if it's deliberate."
    echo ""
  fi
  fail=1
  printf '  %s\n' "$1"
}

# Only inspect added lines in text files staged for commit.
while IFS= read -r file; do
  [ -z "$file" ] && continue
  is_vendored "$file" && continue
  git diff --cached --diff-filter=ACM -U0 -- "$file" 2>/dev/null \
    | grep '^+' | grep -v '^+++' | sed 's/^+//' \
    | while IFS= read -r line; do
        # Phone numbers: +CC then 9+ digits, allowing spaces/dashes/parens.
        if printf '%s' "$line" | grep -qE '\+[0-9][0-9 ()._-]{8,}[0-9]'; then
          printf 'PHONE\t%s\t%s\n' "$file" "$(printf '%s' "$line" | cut -c1-90)"
        fi
        # Emails that aren't Alex's own.
        printf '%s' "$line" \
          | grep -oE '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}' \
          | grep -ivE "$OWN_EMAILS" \
          | grep -ivE '@(example|test|localhost|sentry|schema)\.' \
          | while IFS= read -r addr; do
              printf 'EMAIL\t%s\t%s\n' "$file" "$addr"
            done
      done
done < <(git diff --cached --name-only --diff-filter=ACM) > /tmp/pii-guard-hits.$$ 2>/dev/null

if [ -s /tmp/pii-guard-hits.$$ ]; then
  while IFS= read -r hit; do report "$hit"; done < /tmp/pii-guard-hits.$$
fi
rm -f /tmp/pii-guard-hits.$$

if [ "$fail" -ne 0 ]; then
  echo ""
  exit 1
fi
exit 0
