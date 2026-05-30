"""
[11주차] Feature Flag 시스템
환경 변수 및 대상 사용자 기준으로 플래그를 토글합니다.

사용법:
    from app.core.feature_flags import feature_flags, flag_required

    if feature_flags.is_enabled("NEW_SEARCH_UI"):
        ...

    if feature_flags.is_enabled_for("ENHANCED_RAG", user_id="user-123"):
        ...
"""

import hashlib
import os
from dataclasses import dataclass, field
from enum import Enum
from typing import Optional

from fastapi import HTTPException


class RolloutStrategy(str, Enum):
    ALL        = "all"         # 모든 사용자
    NONE       = "none"        # 비활성화
    PERCENTAGE = "percentage"  # 일정 비율
    ALLOWLIST  = "allowlist"   # 특정 사용자만


@dataclass
class FeatureFlag:
    name: str
    description: str
    enabled: bool = False
    strategy: RolloutStrategy = RolloutStrategy.ALL
    rollout_percentage: float = 0.0
    allowlist: list[str] = field(default_factory=list)


# ────────────────────────────────────────────────────
# 플래그 정의 (5개)
# ────────────────────────────────────────────────────
_FLAGS: dict[str, FeatureFlag] = {
    # 플래그 1: 향상된 RAG 파이프라인 (퍼센티지 롤아웃)
    "ENHANCED_RAG": FeatureFlag(
        name="ENHANCED_RAG",
        description="개선된 RAG 파이프라인 (청킹 전략 최적화)",
        enabled=os.getenv("FF_ENHANCED_RAG", "false").lower() == "true",
        strategy=RolloutStrategy.PERCENTAGE,
        rollout_percentage=float(os.getenv("FF_ENHANCED_RAG_PCT", "30")),
    ),

    # 플래그 2: 새 검색 UI (허용 목록)
    "NEW_SEARCH_UI": FeatureFlag(
        name="NEW_SEARCH_UI",
        description="새로운 민원 검색 인터페이스 (벡터+키워드 하이브리드)",
        enabled=os.getenv("FF_NEW_SEARCH_UI", "false").lower() == "true",
        strategy=RolloutStrategy.ALLOWLIST,
        allowlist=os.getenv("FF_NEW_SEARCH_UI_ALLOWLIST", "").split(","),
    ),

    # 플래그 3: 실험적 LLM 모델
    "EXPERIMENTAL_LLM": FeatureFlag(
        name="EXPERIMENTAL_LLM",
        description="실험적 LLM 모델 사용 (Gemma 3)",
        enabled=os.getenv("FF_EXPERIMENTAL_LLM", "false").lower() == "true",
        strategy=RolloutStrategy.ALL,
    ),

    # 플래그 4: PII 자동 마스킹
    "AUTO_PII_MASKING": FeatureFlag(
        name="AUTO_PII_MASKING",
        description="민원 입력 시 PII 자동 마스킹 적용",
        enabled=os.getenv("FF_AUTO_PII_MASKING", "true").lower() == "true",
        strategy=RolloutStrategy.ALL,
    ),

    # 플래그 5: 엔티티 추출 강화 (퍼센티지 롤아웃)
    "ENHANCED_ENTITY_EXTRACTION": FeatureFlag(
        name="ENHANCED_ENTITY_EXTRACTION",
        description="강화된 엔티티 추출 모델 사용 (NER v2)",
        enabled=os.getenv("FF_ENHANCED_ENTITY_EXTRACTION", "false").lower() == "true",
        strategy=RolloutStrategy.PERCENTAGE,
        rollout_percentage=float(os.getenv("FF_ENHANCED_ENTITY_EXTRACTION_PCT", "50")),
    ),
}


class FeatureFlagService:
    """Feature Flag 서비스 - 환경 변수 기반 토글 관리"""

    def __init__(self, flags: dict[str, FeatureFlag] | None = None):
        self._flags = flags or _FLAGS

    def is_enabled(self, flag_name: str) -> bool:
        """플래그 활성화 여부 확인 (사용자 무관)"""
        flag = self._flags.get(flag_name)
        if not flag or not flag.enabled:
            return False
        if flag.strategy == RolloutStrategy.NONE:
            return False
        if flag.strategy == RolloutStrategy.ALL:
            return True
        return flag.enabled

    def is_enabled_for(self, flag_name: str, user_id: str) -> bool:
        """특정 사용자에 대해 플래그 활성화 여부 확인"""
        flag = self._flags.get(flag_name)
        if not flag or not flag.enabled:
            return False

        if flag.strategy == RolloutStrategy.NONE:
            return False
        if flag.strategy == RolloutStrategy.ALL:
            return True
        if flag.strategy == RolloutStrategy.ALLOWLIST:
            return user_id in flag.allowlist
        if flag.strategy == RolloutStrategy.PERCENTAGE:
            bucket = self._hash_user_to_bucket(user_id, flag_name)
            return bucket < flag.rollout_percentage

        return False

    def get_all_flags(self) -> dict[str, dict]:
        """모든 플래그 상태 반환"""
        return {
            name: {
                "enabled": flag.enabled,
                "description": flag.description,
                "strategy": flag.strategy.value,
                "rollout_percentage": flag.rollout_percentage,
            }
            for name, flag in self._flags.items()
        }

    def override(self, flag_name: str, enabled: bool) -> None:
        """런타임 플래그 오버라이드 (테스트/관리용)"""
        if flag_name in self._flags:
            self._flags[flag_name].enabled = enabled

    @staticmethod
    def _hash_user_to_bucket(user_id: str, flag_name: str) -> float:
        """사용자 ID + 플래그명 → 0-100 버킷 (일관성 보장)"""
        key = f"{flag_name}:{user_id}".encode()
        digest = hashlib.md5(key).hexdigest()
        return (int(digest[:8], 16) % 10000) / 100.0


# 싱글톤 인스턴스
feature_flags = FeatureFlagService()


def flag_required(flag_name: str, user_id_header: str = "X-User-ID"):
    """Feature Flag 비활성화 시 403 반환하는 FastAPI 데코레이터."""
    from functools import wraps

    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            request = kwargs.get("request") or (args[0] if args else None)
            user_id: Optional[str] = None
            if request and hasattr(request, "headers"):
                user_id = request.headers.get(user_id_header)

            enabled = (
                feature_flags.is_enabled_for(flag_name, user_id)
                if user_id
                else feature_flags.is_enabled(flag_name)
            )

            if not enabled:
                raise HTTPException(
                    status_code=403,
                    detail=f"Feature '{flag_name}'은 현재 비활성화되어 있습니다.",
                )
            return await func(*args, **kwargs)

        return wrapper

    return decorator
