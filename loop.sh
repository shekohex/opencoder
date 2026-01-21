#!/usr/bin/env bash

iterations=${1:-100}
shift

echo -e "\033[1;36m$(printf '█%.0s' {1..50})\033[0m"
echo -e "\033[1;36m  █                                    \033[0m"
echo -e "\033[1;36m  █  \033[1;35m░█░█░█░█░█░ \033[1;32mL\033[1;33mO\033[1;31mO\033[1;36mP\033[1;35mE\033[1;32mR\033[0m\033[1;36m  █  \033[1;33m$iterations iterations\033[0m\033[1;36m  █\033[0m"
echo -e "\033[1;36m  █                                    \033[0m"
echo -e "\033[1;36m$(printf '█%.0s' {1..50})\033[0m"
echo ""

start=$(date +%s)

for ((i=1; i<=iterations; i++)); do
  echo -e "\033[1;36m$(printf '═%.0s' {1..50})\033[0m"
  echo -e "\033[1;35m  ┌──────────────────────────────────────┐\033[0m"
  echo -e "\033[1;35m  │  \033[1;33mITERATION $i/$iterations\033[1;35m              │\033[0m"
  echo -e "\033[1;35m  └──────────────────────────────────────┘\033[0m"
  echo -e "\033[1;36m$(printf '═%.0s' {1..50})\033[0m"
  sh -c "$*" || true
done

end=$(date +%s)
duration=$((end - start))
days=$((duration/86400))
hours=$(((duration%86400)/3600))
mins=$(((duration%3600)/60))
secs=$((duration%60))

echo -e "\033[1;32m$(printf '█%.0s' {1..50})\033[0m"
echo -e "\033[1;32m  ✓ COMPLETE: ${days}d ${hours}h ${mins}m ${secs}s\033[0m"
echo -e "\033[1;32m$(printf '█%.0s' {1..50})\033[0m"
