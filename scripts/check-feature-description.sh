#!/bin/bash
# Pre-commit hook: feature 코드 변경 시 feature-description.md 동시 변경 검증

set -euo pipefail

STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACMR)

if [ -z "$STAGED_FILES" ]; then
  exit 0
fi

# feature 코드 변경이 있는 feature 폴더 추출
CHANGED_FEATURES=()
while IFS= read -r file; do
  # src/features/ 하위의 .tsx/.ts 파일만 대상 (mockData, store 제외)
  case "$file" in
    src/features/*)
      case "$file" in
        *.tsx|*.ts)
          case "$file" in
            *feature-description.md*|*mockData*|*store.ts) continue ;;
          esac
          # feature 폴더 추출: src/features/(role)/{feature}
          FEATURE_DIR=$(echo "$file" | sed -E 's|^(src/features/[^/]+/[^/]+)/.*|\1|')
          # 중복 제거
          local_dup=0
          for existing in "${CHANGED_FEATURES[@]:-}"; do
            if [ "$existing" = "$FEATURE_DIR" ]; then
              local_dup=1
              break
            fi
          done
          if [ "$local_dup" -eq 0 ]; then
            CHANGED_FEATURES+=("$FEATURE_DIR")
          fi
          ;;
      esac
      ;;
  esac
done <<< "$STAGED_FILES"

# 변경된 feature가 없으면 통과
if [ ${#CHANGED_FEATURES[@]} -eq 0 ]; then
  exit 0
fi

MISSING=()
for FEATURE_DIR in "${CHANGED_FEATURES[@]}"; do
  MD_FILE="$FEATURE_DIR/feature-description.md"
  if ! echo "$STAGED_FILES" | grep -qF "$MD_FILE"; then
    MISSING+=("$MD_FILE")
  fi
done

if [ ${#MISSING[@]} -gt 0 ]; then
  echo ""
  echo "  feature-description.md 동기화 필요:"
  echo ""
  for m in "${MISSING[@]}"; do
    echo "  - $m"
  done
  echo ""
  echo "feature 코드가 변경되었지만 feature-description.md가 함께 staged 되지 않았습니다."
  echo "해당 md 파일을 업데이트한 후 git add 해주세요."
  echo ""
  echo "건너뛰려면: git commit --no-verify"
  exit 1
fi
