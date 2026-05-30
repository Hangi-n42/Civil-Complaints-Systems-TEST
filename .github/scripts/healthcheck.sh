#!/bin/bash
# Canary 배포 헬스체크 스크립트
# 사용법: ./healthcheck.sh <API_URL> <MAX_RETRIES>

API_URL="${1:-http://localhost:8000}"
MAX_RETRIES="${2:-5}"
HEALTH_ENDPOINT="${API_URL}/health"
ERROR_RATE_THRESHOLD=5    # 에러율 5% 초과 시 롤백

echo "헬스체크 시작: $HEALTH_ENDPOINT (최대 ${MAX_RETRIES}회)"

success=0
fail=0

for ((i=1; i<=MAX_RETRIES; i++)); do
  HTTP_STATUS=$(curl -s -o /tmp/health.json -w "%{http_code}" \
    --connect-timeout 5 --max-time 10 "$HEALTH_ENDPOINT" || echo "000")

  if [ "$HTTP_STATUS" = "200" ]; then
    echo "  ✅ 시도 $i/$MAX_RETRIES: HTTP $HTTP_STATUS"
    success=$((success + 1))
  else
    echo "  ❌ 시도 $i/$MAX_RETRIES: HTTP $HTTP_STATUS"
    fail=$((fail + 1))
  fi

  sleep 5
done

TOTAL=$((success + fail))
ERROR_RATE=$(( (fail * 100) / TOTAL ))

echo ""
echo "결과: 성공 $success / 실패 $fail / 에러율 ${ERROR_RATE}%"

if [ "$ERROR_RATE" -gt "$ERROR_RATE_THRESHOLD" ]; then
  echo "❌ 에러율 ${ERROR_RATE}%가 임계값 ${ERROR_RATE_THRESHOLD}%를 초과 → 롤백 트리거"
  exit 1
fi

echo "✅ 헬스체크 통과"
exit 0
