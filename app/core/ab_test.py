"""
[11주차] A/B 테스트 시스템
2개 variant 구성, 사용자 할당 일관성, 이벤트 추적 로직 포함

실험 1: RAG_STRATEGY - 기본 RAG vs 향상된 RAG 비교
실험 2: SEARCH_RANKING - BM25 vs 벡터 유사도 순위 비교
"""

import hashlib
import json
import logging
import time
from dataclasses import asdict, dataclass, field
from enum import Enum
from pathlib import Path
from typing import Optional

logger = logging.getLogger(__name__)


class Variant(str, Enum):
    CONTROL   = "control"    # A: 기존 방식
    TREATMENT = "treatment"  # B: 새로운 방식


@dataclass
class Experiment:
    name: str
    description: str
    active: bool
    control_weight: float = 50.0  # control 할당 비율 (%)


@dataclass
class ExperimentEvent:
    experiment: str
    variant: str
    user_id: str
    event_type: str           # "assignment" | "conversion" | "impression"
    value: Optional[float] = None
    metadata: dict = field(default_factory=dict)
    timestamp: float = field(default_factory=time.time)


# ────────────────────────────────────────────────────
# 실험 정의 (2개)
# ────────────────────────────────────────────────────
EXPERIMENTS: dict[str, Experiment] = {
    "RAG_STRATEGY": Experiment(
        name="RAG_STRATEGY",
        description="기본 RAG(control) vs 향상된 청킹+재순위(treatment) 품질 비교",
        active=True,
        control_weight=50.0,
    ),
    "SEARCH_RANKING": Experiment(
        name="SEARCH_RANKING",
        description="BM25 키워드 검색(control) vs 벡터 유사도 검색(treatment) 비교",
        active=True,
        control_weight=50.0,
    ),
}


class ABTestService:
    """A/B 테스트 서비스 - 사용자 할당 및 이벤트 추적"""

    def __init__(
        self,
        experiments: dict[str, Experiment] | None = None,
        event_log_path: str | Path = "logs/ab_test_events.jsonl",
    ):
        self._experiments = experiments or EXPERIMENTS
        self._event_log_path = Path(event_log_path)
        self._event_log_path.parent.mkdir(parents=True, exist_ok=True)

    def assign(self, experiment_name: str, user_id: str) -> Variant:
        """사용자를 실험 variant에 일관되게 할당."""
        exp = self._experiments.get(experiment_name)
        if not exp or not exp.active:
            return Variant.CONTROL

        bucket = self._hash_to_bucket(user_id, experiment_name)
        variant = Variant.CONTROL if bucket < exp.control_weight else Variant.TREATMENT

        self._log_event(ExperimentEvent(
            experiment=experiment_name,
            variant=variant.value,
            user_id=user_id,
            event_type="assignment",
        ))

        return variant

    def track(
        self,
        experiment_name: str,
        user_id: str,
        event_type: str,
        value: Optional[float] = None,
        metadata: dict | None = None,
    ) -> None:
        """실험 이벤트 추적."""
        variant = self.assign(experiment_name, user_id)
        self._log_event(ExperimentEvent(
            experiment=experiment_name,
            variant=variant.value,
            user_id=user_id,
            event_type=event_type,
            value=value,
            metadata=metadata or {},
        ))

    def get_results_summary(self, experiment_name: str) -> dict:
        """실험 결과 집계 요약."""
        events: list[ExperimentEvent] = self._load_events(experiment_name)

        if not events:
            return {"error": "이벤트 데이터 없음"}

        from collections import defaultdict
        summary: dict[str, dict] = defaultdict(
            lambda: {"count": 0, "conversions": 0, "total_value": 0.0}
        )
        assigned_users: dict[str, set] = {v.value: set() for v in Variant}

        for event in events:
            v = event.variant
            if event.event_type == "assignment":
                assigned_users.setdefault(v, set()).add(event.user_id)
                summary[v]["count"] = len(assigned_users[v])
            elif event.event_type == "conversion":
                summary[v]["conversions"] += 1
            if event.value is not None:
                summary[v]["total_value"] += event.value

        for v_data in summary.values():
            cnt = v_data["count"]
            v_data["conversion_rate"] = (
                round(v_data["conversions"] / cnt * 100, 2) if cnt > 0 else 0
            )
            v_data["avg_value"] = round(
                v_data["total_value"] / max(v_data["conversions"], 1), 2
            )

        return {"experiment": experiment_name, "variants": dict(summary)}

    @staticmethod
    def _hash_to_bucket(user_id: str, experiment_name: str) -> float:
        """사용자 ID + 실험명 → 0.0~100.0 버킷 (일관성 보장)"""
        key = f"{experiment_name}:{user_id}".encode()
        digest = hashlib.sha256(key).hexdigest()
        return (int(digest[:8], 16) % 10000) / 100.0

    def _log_event(self, event: ExperimentEvent) -> None:
        try:
            with open(self._event_log_path, "a", encoding="utf-8") as f:
                f.write(json.dumps(asdict(event), ensure_ascii=False) + "\n")
        except Exception as e:
            logger.warning(f"이벤트 기록 실패: {e}")

    def _load_events(self, experiment_name: str) -> list[ExperimentEvent]:
        if not self._event_log_path.exists():
            return []
        events = []
        with open(self._event_log_path, encoding="utf-8") as f:
            for line in f:
                try:
                    data = json.loads(line.strip())
                    if data.get("experiment") == experiment_name:
                        events.append(ExperimentEvent(**data))
                except (json.JSONDecodeError, TypeError):
                    continue
        return events


# 싱글톤 인스턴스
ab_test = ABTestService()
