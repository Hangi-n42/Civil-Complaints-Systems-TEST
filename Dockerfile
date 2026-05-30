# ════════════════════════════════════════════════════════════
# 민원 AI 시스템 - 멀티스테이지 Docker 빌드
# 스테이지 1: 빌더 (의존성 설치)
# 스테이지 2: 프로덕션 (최소 이미지)
# ════════════════════════════════════════════════════════════

# ── 스테이지 1: 빌더 ──────────────────────────────────────
FROM python:3.11-slim AS builder

WORKDIR /build

# 시스템 의존성 설치 (빌드 도구만)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# pip 업그레이드 및 의존성 설치
COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install --no-cache-dir --prefix=/install -r requirements.txt

# ── 스테이지 2: 프로덕션 ─────────────────────────────────
FROM python:3.11-slim AS production

# 보안: root가 아닌 전용 사용자로 실행
RUN groupadd -r appuser && useradd -r -g appuser appuser

WORKDIR /app

# 빌더에서 설치된 패키지만 복사
COPY --from=builder /install /usr/local

# 애플리케이션 코드 복사
COPY app/ ./app/
COPY configs/ ./configs/
COPY schemas/ ./schemas/

# 환경변수 기본값 설정
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000 \
    HOST=0.0.0.0 \
    LOG_LEVEL=info

# 소유권 변경
RUN chown -R appuser:appuser /app

USER appuser

# 헬스체크: 30초마다 /health 엔드포인트 확인
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:${PORT}/health')" || exit 1

EXPOSE $PORT

# FastAPI 서버 실행
CMD ["python", "-m", "uvicorn", "app.api.main:app", "--host", "0.0.0.0", "--port", "8000", "--log-level", "info"]
