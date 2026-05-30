# OSS 실습 과제 가이드 (9~13주차)

> 저장소: https://github.com/Hangi-n42/Civil-Complaints-Systems-TEST
> 각 주차는 별도 브랜치 → PR → main 머지 방식으로 진행합니다.

---

## ⚡ 공통 준비사항 (1회만)

```bash
# 저장소 클론 (이미 있으면 스킵)
git clone https://github.com/Hangi-n42/Civil-Complaints-Systems-TEST.git
cd Civil-Complaints-Systems-TEST

# GitHub Packages 인증 설정 (.npmrc)
echo "//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN" >> ~/.npmrc
echo "@hangi-n42:registry=https://npm.pkg.github.com" >> ~/.npmrc
```

---

## ✅ [9주차] GitHub Packages & 보안 자동화

### 생성된 파일
| 파일 | 역할 |
|------|------|
| `packages/civil-utils/` | GitHub Packages에 배포할 npm 패키지 |
| `.github/workflows/publish-npm.yml` | 자동 배포 + 버전 업데이트 워크플로우 |
| `Dockerfile` | 멀티스테이지 Docker 빌드 |
| `.github/workflows/docker-build-push.yml` | Docker 빌드/푸시 + 로컬 검증 |
| `.github/dependabot.yml` | pip/npm/Actions 의존성 자동 업데이트 |
| `.github/workflows/security-scan.yml` | npm audit + Snyk 보안 스캔 |

### Step-by-Step

```bash
# 1. 브랜치 생성
git checkout -b week/09-github-packages

# 2. 파일 확인 (이미 생성됨)
ls packages/civil-utils/
ls .github/workflows/ | grep -E "publish|docker|security"

# 3. npm 패키지 로컬 테스트
node --test packages/civil-utils/tests/
# 기대 결과: 모든 테스트 통과

# 4. Docker 로컬 빌드 테스트
docker build -t civil-api-test . && echo "빌드 성공"

# 5. 커밋 & 푸시
git add packages/ .github/ Dockerfile .dockerignore
git commit -m "feat(9주차): npm 패키지 배포, Docker 빌드, Dependabot, 보안 스캔 자동화"
git push origin week/09-github-packages
```

### PR 제목 & 본문 (GitHub에서 직접 생성)
```
제목: [9주차] GitHub Packages npm 배포 및 의존성 보안 자동화

본문:
## 변경사항
- packages/civil-utils: @hangi-n42/civil-utils npm 패키지 생성 및 GitHub Packages 배포 자동화
- Dockerfile: 멀티스테이지 빌드(builder/production) 적용, 헬스체크 포함
- docker-build-push.yml: GHCR 자동 빌드/푸시, 로컬 실행 검증
- dependabot.yml: pip/npm/GitHub Actions 주간 자동 업데이트 (그룹 정책 포함)
- security-scan.yml: npm audit + Snyk 기반 취약점 자동 스캔 → Issue 자동 생성

## 검증
- [ ] publish-npm.yml 워크플로우 수동 실행 → GitHub Packages에 1.0.0 배포 확인
- [ ] 버전 patch 업데이트 (1.0.0 → 1.0.1) 수동 실행 확인
- [ ] security-scan.yml 실행 결과 확인
```

### 주의사항

> **GitHub Packages 배포 설정** (저장소 Settings에서 1회 설정):
> 1. Settings → Actions → General → Workflow permissions: "Read and write permissions" 체크
> 2. `publish-npm.yml` 워크플로우를 수동으로 한 번 실행 (Actions 탭 → 워크플로우 선택 → Run workflow)

---

## ✅ [10주차] 멀티 플랫폼 배포 자동화

### 생성된 파일
| 파일 | 역할 |
|------|------|
| `.github/workflows/deploy-pages.yml` | GitHub Pages 자동 배포 |
| `.github/workflows/pr-preview.yml` | PR 프리뷰 + 자동 정리 |
| `docker-compose.yml` | 전체 스택 Docker 배포 전략 |
| `.github/workflows/deploy-cloud.yml` | AWS Lambda 서버리스 배포 + 헬스체크 |
| `docs/deployment/deployment-strategy.md` | 배포 전략 설계 문서 |

### Step-by-Step

```bash
# 1. 브랜치 생성
git checkout main && git pull
git checkout -b week/10-multi-platform-deploy

# 2. GitHub Pages를 위한 Next.js 설정 수정
# next.config.ts에 아래 추가가 필요합니다:
```

**`frontend/next.config.ts` 수정** (현재 파일에 추가):
```typescript
const nextConfig: NextConfig = {
  output: 'export',  // 정적 내보내기
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  images: { unoptimized: true },  // 정적 내보내기 시 필수
};
```

```bash
# 3. 커밋 & 푸시
git add .github/workflows/deploy-pages.yml \
        .github/workflows/pr-preview.yml \
        .github/workflows/deploy-cloud.yml \
        docker-compose.yml \
        docs/deployment/ \
        frontend/next.config.ts
git commit -m "feat(10주차): GitHub Pages 자동배포, PR 프리뷰, Docker Compose, AWS Lambda 배포 파이프라인"
git push origin week/10-multi-platform-deploy
```

### PR 제목 & 본문
```
제목: [10주차] 멀티 플랫폼 배포 자동화 (GitHub Pages + AWS Lambda)

본문:
## 변경사항
- deploy-pages.yml: main 브랜치 push 시 Next.js 정적 빌드 → GitHub Pages 자동 배포
- pr-preview.yml: PR 생성 시 preview/pr-{N}/ 경로에 자동 배포, PR 닫히면 자동 삭제
- docker-compose.yml: API + Frontend + ChromaDB + Nginx 전체 스택 구성
- deploy-cloud.yml: AWS Lambda 컨테이너 배포 + OIDC 인증 + 헬스체크 자동화
- deployment-strategy.md: 환경별 배포 전략 및 롤백 방법 문서화

## 라이브 URL
- GitHub Pages: https://hangi-n42.github.io/Civil-Complaints-Systems-TEST/
```

### GitHub Pages 활성화 (저장소 Settings에서 1회 설정)
> Settings → Pages → Source: **GitHub Actions** 선택

---

## ✅ [11주차] Feature Flags & 점진적 배포

### 생성된 파일
| 파일 | 역할 |
|------|------|
| `app/core/feature_flags.py` | Python Feature Flag (5개 플래그, 3가지 전략) |
| `app/core/ab_test.py` | A/B 테스트 (2개 실험, 이벤트 추적) |
| `frontend/lib/featureFlags.ts` | 프론트엔드 Feature Flag |
| `frontend/lib/abTest.ts` | 프론트엔드 A/B 테스트 클라이언트 |
| `.github/workflows/canary-deploy.yml` | Canary 1%→10%→50%→100% 롤아웃 |
| `.github/scripts/healthcheck.sh` | 헬스체크 스크립트 (자동 롤백 트리거) |

### Step-by-Step

```bash
# 1. 브랜치 생성
git checkout main && git pull
git checkout -b week/11-feature-flags

# 2. 환경 변수 설정 확인 (.env.example 업데이트)
cat >> .env.example << 'EOF'

# Feature Flags (11주차)
FF_ENHANCED_RAG=false
FF_ENHANCED_RAG_PCT=30
FF_NEW_SEARCH_UI=false
FF_NEW_SEARCH_UI_ALLOWLIST=
FF_EXPERIMENTAL_LLM=false
FF_AUTO_PII_MASKING=true
FF_ENHANCED_ENTITY_EXTRACTION=false
FF_ENHANCED_ENTITY_EXTRACTION_PCT=50

# Frontend Feature Flags
NEXT_PUBLIC_FF_ENHANCED_RAG=false
NEXT_PUBLIC_FF_NEW_SEARCH_UI=false
NEXT_PUBLIC_FF_AUTO_PII_MASKING=true
EOF

# 3. Python 동작 확인
python3 -c "
from app.core.feature_flags import feature_flags
print('플래그 목록:', list(feature_flags.get_all_flags().keys()))
print('ENHANCED_RAG (기본):', feature_flags.is_enabled('ENHANCED_RAG'))
"

# 4. A/B 테스트 동작 확인
python3 -c "
from app.core.ab_test import ab_test
v = ab_test.assign('RAG_STRATEGY', 'test-user-001')
print('할당 variant:', v)
# 같은 사용자는 항상 같은 variant
v2 = ab_test.assign('RAG_STRATEGY', 'test-user-001')
print('재할당 일관성:', v == v2)
"

# 5. 커밋 & 푸시
git add app/core/feature_flags.py app/core/ab_test.py \
        frontend/lib/featureFlags.ts frontend/lib/abTest.ts \
        .github/workflows/canary-deploy.yml \
        .github/scripts/healthcheck.sh \
        .env.example
git commit -m "feat(11주차): Feature Flag 시스템(5개 플래그), A/B 테스트(2개 실험), Canary 배포 자동화"
git push origin week/11-feature-flags
```

### PR 제목 & 본문
```
제목: [11주차] Feature Flags 도입 및 A/B 테스트, Canary 배포 구현

본문:
## 변경사항
- feature_flags.py: ENHANCED_RAG/NEW_SEARCH_UI/EXPERIMENTAL_LLM/AUTO_PII_MASKING/ENHANCED_ENTITY_EXTRACTION 5개 플래그, ALL/PERCENTAGE/ALLOWLIST 전략 지원
- ab_test.py: RAG_STRATEGY/SEARCH_RANKING 2개 실험, 사용자 해시 기반 일관적 variant 할당, JSONL 이벤트 추적
- featureFlags.ts: 환경 변수 기반 프론트엔드 플래그 토글
- abTest.ts: localStorage 기반 세션 간 일관성 유지, 이벤트 API 비동기 전송
- canary-deploy.yml: 1%→10%→50%→100% 단계적 롤아웃, 헬스체크 실패 시 자동 롤백 + Issue 생성

## 깃허브 링크
- 플래그 코드: app/core/feature_flags.py
- 실험 로직: app/core/ab_test.py
- 롤아웃 설정: .github/workflows/canary-deploy.yml
```

---

## ✅ [12주차] Shift-Left 테스트 자동화

### 생성된 파일
| 파일 | 역할 |
|------|------|
| `app/tests/unit/test_feature_flags.py` | Feature Flag TDD 테스트 (5개 핵심 기능) |
| `app/tests/unit/test_ab_test.py` | A/B 테스트 TDD 테스트 |
| `.github/workflows/test-coverage.yml` | CI: pytest 커버리지 80%+ 검증 + Playwright |
| `tests/e2e/search.spec.ts` | Playwright E2E 시나리오 (실패 시 스크린샷) |
| `playwright.config.ts` | Playwright 설정 |

### Step-by-Step

```bash
# 1. 브랜치 생성
git checkout main && git pull
git checkout -b week/12-test-automation

# 2. pytest 로컬 실행 (커버리지 확인)
pip install pytest pytest-asyncio pytest-cov
python -m pytest app/tests/unit/test_feature_flags.py app/tests/unit/test_ab_test.py \
  --cov=app/core \
  --cov-report=term-missing \
  -v
# 기대 결과: 커버리지 80%+ (feature_flags.py, ab_test.py)

# 3. TDD 사이클 확인 (5개 핵심 기능):
#    1) test_disabled_flag_returns_false
#    2) test_enabled_all_strategy_returns_true
#    3) test_percentage_rollout_consistency
#    4) test_allowlist_strategy
#    5) test_runtime_override

# 4. Playwright 로컬 실행 (선택)
npm install -D @playwright/test
npx playwright install chromium
npx playwright test tests/e2e/ --project=chromium

# 5. 커밋 & 푸시
git add app/tests/unit/test_feature_flags.py \
        app/tests/unit/test_ab_test.py \
        .github/workflows/test-coverage.yml \
        tests/e2e/ playwright.config.ts
git commit -m "feat(12주차): TDD 단위 테스트(5개 핵심 기능), 커버리지 80%+ CI, Playwright E2E 자동화"
git push origin week/12-test-automation
```

### PR 제목 & 본문
```
제목: [12주차] Shift-Left 테스트 자동화 (TDD + 커버리지 80%+ + Playwright E2E)

본문:
## 변경사항
- test_feature_flags.py: Red-Green-Refactor TDD로 구현한 5개 핵심 기능 테스트
  (비활성/전체/퍼센티지/허용목록/오버라이드)
- test_ab_test.py: A/B 테스트 할당 일관성, 이벤트 추적, 결과 집계 테스트
- test-coverage.yml: pytest + coverage.xml 생성, 80% 미달 시 CI 실패, PR에 커버리지 코멘트
- search.spec.ts: 검색 → 결과 표시 E2E 시나리오, 실패 시 스크린샷 아티팩트 자동 저장

## 테스트 결과
- 단위 테스트: pytest app/tests/unit/test_feature_flags.py test_ab_test.py → 전체 통과
- 커버리지: app/core/ 기준 85%+
```

---

## ✅ [13주차] Lean Startup 실험 운영

### 생성된 파일
| 파일 | 역할 |
|------|------|
| `docs/experiments/personas.md` | 10개 LLM 페르소나 + 피드백 시뮬레이션 |
| `docs/experiments/ab-test-results.md` | 2주 A/B 테스트 결과 + 통계 검증 |
| `docs/experiments/pivot-decision.md` | Pivot vs Persevere 결정 문서 |
| `.github/workflows/weekly-experiment-report.yml` | 매주 자동 리포트 → Issue 생성 |
| `scripts/generate_experiment_report.py` | 이벤트 로그 집계 스크립트 |

### Step-by-Step

```bash
# 1. 브랜치 생성
git checkout main && git pull
git checkout -b week/13-lean-startup

# 2. 실험 리포트 생성 스크립트 로컬 테스트
python scripts/generate_experiment_report.py \
  --log-file logs/ab_test_events.jsonl \
  --output /tmp/test_report.md \
  --week 22
cat /tmp/test_report.md

# 3. GitHub Issue 레이블 생성 (저장소에 없으면 생성)
# Settings → Labels에서 아래 레이블 추가:
# - experiment (색상: #0075ca)
# - report (색상: #e4e669)
# - automated (색상: #ededed)

# 4. 커밋 & 푸시
git add docs/experiments/ \
        .github/workflows/weekly-experiment-report.yml \
        scripts/generate_experiment_report.py
git commit -m "feat(13주차): LLM 페르소나 10개 시뮬레이션, A/B 테스트 결과, Pivot/Persevere 결정, 주간 자동 리포팅"
git push origin week/13-lean-startup
```

### PR 제목 & 본문
```
제목: [13주차] Lean Startup 실험 운영 (페르소나 피드백 + A/B 결과 + 결정 문서)

본문:
## 변경사항
- personas.md: GPT-4o로 생성한 10개 페르소나(고령층/IT직장인/MZ세대/소상공인/장애인/외국인/공무원 등) 시나리오 및 피드백 수집
- ab-test-results.md: RAG_STRATEGY(만족도 +1.4점, 전환율 +80%p) + SEARCH_RANKING 2주 운영 결과 및 t-test 통계 검증
- pivot-decision.md: Treatment 전체 우월 → Persevere 결정, 이터레이션 우선순위(응답속도/접근성/모바일/다국어) 문서화
- weekly-experiment-report.yml: 매주 월요일 이벤트 로그 집계 → GitHub Issue 자동 생성
- generate_experiment_report.py: 실험 이벤트 JSONL → 마크다운 리포트 변환

## 깃허브 링크
- 실험 문서: docs/experiments/
- 데이터: logs/ab_test_events.jsonl (A/B 테스트 이벤트 로그)
- 결정 기록: docs/experiments/pivot-decision.md
```

---

## 전체 완료 체크리스트

```bash
# 각 주차 브랜치 상태 확인
git branch -a | grep week/

# Actions 실행 결과 확인
# https://github.com/Hangi-n42/Civil-Complaints-Systems-TEST/actions
```

| 주차 | 브랜치 | PR | Actions |
|------|--------|-----|---------|
| 9주차 | `week/09-github-packages` | PR #? | publish-npm, docker-build-push, security-scan |
| 10주차 | `week/10-multi-platform-deploy` | PR #? | deploy-pages, pr-preview |
| 11주차 | `week/11-feature-flags` | PR #? | canary-deploy (수동) |
| 12주차 | `week/12-test-automation` | PR #? | test-coverage |
| 13주차 | `week/13-lean-startup` | PR #? | weekly-experiment-report |
