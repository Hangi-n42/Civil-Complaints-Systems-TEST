# 배포 파이프라인 전략 설계

## 개요

민원 AI 시스템의 멀티 플랫폼 배포 전략입니다.

## 아키텍처

```
┌─────────────────────────────────────────────────┐
│                  GitHub main 브랜치               │
└──────────┬──────────────────────┬───────────────┘
           │                      │
    ┌──────▼──────┐        ┌──────▼──────┐
    │  프론트엔드  │        │  백엔드 API  │
    │ (Next.js)   │        │  (FastAPI)   │
    └──────┬──────┘        └──────┬──────┘
           │                      │
    ┌──────▼──────┐        ┌──────▼──────┐
    │GitHub Pages │        │ AWS Lambda  │
    │  (정적 SPA)  │        │  (서버리스)  │
    └─────────────┘        └─────────────┘
```

## 환경 구성

| 환경 | 트리거 | 프론트엔드 | 백엔드 | 목적 |
|------|--------|-----------|--------|------|
| **preview** | PR 생성/업데이트 | GitHub Pages (pr-N/) | 없음 | 코드 리뷰 |
| **staging** | main push | GitHub Pages | AWS Lambda (staging) | 통합 테스트 |
| **production** | 수동 트리거 | GitHub Pages | AWS Lambda (prod) | 운영 |

## 배포 파이프라인

### 프론트엔드 (Next.js → GitHub Pages)

```
PR 열림 → 프리뷰 빌드 → preview/pr-{N}/ 배포 → PR 코멘트에 URL 추가
main push → 프로덕션 빌드 → GitHub Pages 배포
PR 닫힘 → 프리뷰 디렉토리 자동 삭제
```

**설정 필요 사항 (저장소 Settings):**
1. Settings → Pages → Source: `gh-pages` 브랜치
2. `next.config.ts`에 `output: 'export'` 및 `basePath` 설정

### 백엔드 (FastAPI → AWS Lambda)

```
main push → Docker 빌드 → ECR 푸시 → Lambda 이미지 업데이트
→ Lambda 준비 대기 → 헬스체크 (/health) → CloudWatch 알람 확인
```

**필요한 GitHub Secrets:**
- `AWS_ROLE_ARN`: AWS IAM Role ARN (OIDC 연동)
- `API_GATEWAY_URL`: API Gateway 엔드포인트 URL

### Docker Compose (로컬/온프레미스)

```bash
# 개발 환경
docker compose up -d

# 프로덕션 (Nginx 포함)
docker compose --profile production up -d
```

## 헬스체크 엔드포인트

모든 환경에서 `/health` 엔드포인트가 응답해야 합니다.

```json
{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "2026-05-31T00:00:00Z",
  "services": {
    "chromadb": "ok",
    "ollama": "ok"
  }
}
```

## 롤백 전략

- **Lambda**: 이전 버전으로 즉시 전환 (`aws lambda update-alias`)
- **GitHub Pages**: 이전 커밋으로 `git revert` 후 재배포
- **Docker**: 이전 이미지 태그로 `docker compose` 재실행
