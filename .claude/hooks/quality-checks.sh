#!/usr/bin/env bash
set -euo pipefail

cd "$CLAUDE_PROJECT_DIR"

declare -a failures=()
declare -a commands=(
  "bun run check"
  "bun run check-types"
  "bun run test"
)

for cmd in "${commands[@]}"; do
  echo "Running: $cmd" >&2
  if ! eval "$cmd" 2>&1; then
    failures+=("$cmd")
  fi
done

if [ ${#failures[@]} -gt 0 ]; then
  echo "## Quality checks failed" >&2
  echo "" >&2
  echo "The following commands failed:" >&2
  for failed in "${failures[@]}"; do
    echo "  - $failed" >&2
  done
  echo "" >&2
  echo "Please fix the issues above before continuing." >&2
  exit 2
fi

exit 0
