#!/usr/bin/env bash
set -euo pipefail

# Script to compute total word count of .md files in source/content
# excluding source/content/index.md, and to update the index.md file
# with the computed total in a stable marker line.

CONTENT_DIR="source/content"
INDEX_FILE="$CONTENT_DIR/index.md"

if [ ! -d "$CONTENT_DIR" ]; then
  echo "Error: content directory '$CONTENT_DIR' not found." >&2
  exit 1
fi

if [ ! -f "$INDEX_FILE" ]; then
  echo "Error: index file '$INDEX_FILE' not found." >&2
  exit 1
fi

# Compute total words (exclude index.md) in a robust way
TOTAL=0
while IFS= read -r -d '' file; do
  # wc -w <file> outputs a number; use command substitution safely
  words=$(wc -w < "$file" | tr -d ' ')
  # ensure numeric
  if [[ "$words" =~ ^[0-9]+$ ]]; then
    TOTAL=$((TOTAL + words))
  fi
done < <(find "$CONTENT_DIR" -type f -name '*.md' ! -path "$INDEX_FILE" -print0)

# Prepare replacement line. We use a marker so replacement is deterministic.
# Format number with commas for readability (works with arbitrary-length integers)
format_with_commas() {
  # Reverse, insert comma every 3 digits, reverse back, strip leading comma if any
  echo "$1" | rev | sed -E 's/([0-9]{3})/\1,/g' | rev | sed 's/^,//'
}

FORMATTED_TOTAL=$(format_with_commas "$TOTAL")

# Reference: Order of the Phoenix word count
HP_COUNT=257045
# Compute ratio = TOTAL / HP_COUNT, print as integer when whole, otherwise two decimals
RATIO=$(awk -v t="$TOTAL" -v h="$HP_COUNT" 'BEGIN{ r=t/h; if(r==int(r)) printf("%d", r); else printf("%.2f", r) }')

REPLACEMENT="- **Word count:** $FORMATTED_TOTAL words (AKA The Order of the Phoenix x $RATIO)."

# We will replace any existing line that starts with the marker "- **Content word count (all `.md` files in `source/content`, excluding this file):**"
# Use awk to rewrite the file, replacing the matching line or inserting after the first '---' block if not present.

TMPFILE=$(mktemp)

awk -v repl="$REPLACEMENT" '
  BEGIN{replaced=0}
  # If we encounter either marker, only print the replacement once; skip subsequent marker lines
  $0 ~ /^- \*\*Word count/ {
    if(replaced==0){ print repl; replaced=1 } 
    next
  }
  $0 ~ /^- \*\*Content word count/ {
    if(replaced==0){ print repl; replaced=1 }
    next
  }
  { print }
  END{ }
' "$INDEX_FILE" > "$TMPFILE"

# If no replacement was done, insert after the first '---' block end (first blank line after the initial frontmatter or after the first '---' that ends frontmatter)
if ! grep -q "Word count" "$TMPFILE"; then
  # Find the line number of the first '---' after the YAML frontmatter start
  # We'll insert the replacement after the first empty line following the initial '---' block or after the first '---' that appears after the top.
  # Simpler approach: insert the replacement after the first occurrence of a line that contains only '---' and is followed by a blank line.
  
  # Try to detect the spot: after the first blank line following a '---' line.
  LINE_NUM=$(awk 'NR==1{start=1} { if($0=="---" && start==1){ in_front=1; next } if(in_front && $0=="") { print NR; exit } }' "$INDEX_FILE" || true)
  if [ -n "$LINE_NUM" ]; then
    # Insert at LINE_NUM (which is the blank line), so append before that line
    awk -v ins="$REPLACEMENT" -v lineno="$LINE_NUM" 'NR==lineno{ print ins } { print }' "$TMPFILE" > "$TMPFILE.tmp" && mv "$TMPFILE.tmp" "$TMPFILE"
  else
    # Fallback: prepend the replacement after the first header area (after first '---')
    awk -v ins="$REPLACEMENT" 'NR==1{print} {print}' "$TMPFILE" > "$TMPFILE.tmp" && mv "$TMPFILE.tmp" "$TMPFILE"
  fi
fi

# Replace the index file
mv "$TMPFILE" "$INDEX_FILE"

echo "Updated $INDEX_FILE with total: $TOTAL words."

# If we're inside a git repository, stage the updated index file so the change is included in the commit
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  if git add -- "$INDEX_FILE"; then
    echo "Staged $INDEX_FILE for commit."
  else
    echo "Warning: failed to stage $INDEX_FILE" >&2
  fi
fi

chmod +x "$0" || true

exit 0
