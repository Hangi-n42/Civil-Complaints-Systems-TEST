"""
[12주차] Feature Flag TDD 테스트
Red-Green-Refactor 사이클로 구현한 핵심 기능 테스트

TDD 사이클:
1. test_is_enabled_returns_false_when_disabled → 실패 → feature_flags.py 구현 → 통과
2. test_is_enabled_returns_true_when_enabled → 실패 → 구현 → 통과
3. test_percentage_rollout_consistency → 실패 → 구현 → 통과
4. test_allowlist_strategy → 실패 → 구현 → 통과
5. test_inactive_flag_returns_control → 실패 → 구현 → 통과
"""

import sys
from pathlib import Path

import pytest

PROJECT_ROOT = Path(__file__).resolve().parents[3]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from app.core.feature_flags import (
    FeatureFlag,
    FeatureFlagService,
    RolloutStrategy,
)


@pytest.fixture
def svc():
    """테스트용 Feature Flag 서비스 (격리된 플래그 집합)"""
    flags = {
        "ALWAYS_ON": FeatureFlag(
            name="ALWAYS_ON",
            description="항상 활성화",
            enabled=True,
            strategy=RolloutStrategy.ALL,
        ),
        "ALWAYS_OFF": FeatureFlag(
            name="ALWAYS_OFF",
            description="항상 비활성화",
            enabled=False,
        ),
        "PCT_50": FeatureFlag(
            name="PCT_50",
            description="50% 롤아웃",
            enabled=True,
            strategy=RolloutStrategy.PERCENTAGE,
            rollout_percentage=50.0,
        ),
        "ALLOWLIST": FeatureFlag(
            name="ALLOWLIST",
            description="허용 목록",
            enabled=True,
            strategy=RolloutStrategy.ALLOWLIST,
            allowlist=["user-alpha", "user-beta"],
        ),
    }
    return FeatureFlagService(flags=flags)


# ── TDD 핵심 기능 1: 비활성 플래그 ───────────────────────────
class TestIsEnabled:
    def test_disabled_flag_returns_false(self, svc):
        """[Red→Green] 비활성 플래그는 False 반환"""
        assert svc.is_enabled("ALWAYS_OFF") is False

    def test_enabled_all_strategy_returns_true(self, svc):
        """[Red→Green] 전체 전략 활성 플래그는 True 반환"""
        assert svc.is_enabled("ALWAYS_ON") is True

    def test_unknown_flag_returns_false(self, svc):
        """[Red→Green] 존재하지 않는 플래그는 False 반환"""
        assert svc.is_enabled("NONEXISTENT") is False


# ── TDD 핵심 기능 2: 퍼센티지 롤아웃 일관성 ─────────────────
class TestPercentageRollout:
    def test_same_user_always_gets_same_result(self, svc):
        """[Red→Green] 같은 user_id는 항상 같은 결과 반환 (일관성)"""
        results = [svc.is_enabled_for("PCT_50", "user-123") for _ in range(10)]
        assert len(set(results)) == 1  # 모두 동일한 값

    def test_different_users_have_different_buckets(self, svc):
        """[Red→Green] 서로 다른 사용자는 다른 버킷에 할당될 수 있음"""
        users = [f"user-{i}" for i in range(100)]
        results = [svc.is_enabled_for("PCT_50", u) for u in users]
        # 50% 롤아웃이므로 일부는 True, 일부는 False여야 함
        assert True in results
        assert False in results

    def test_zero_percentage_returns_false(self, svc):
        """[Red→Green] 0% 롤아웃 플래그는 항상 False"""
        flags = {
            "PCT_0": FeatureFlag(
                name="PCT_0",
                description="0% 롤아웃",
                enabled=True,
                strategy=RolloutStrategy.PERCENTAGE,
                rollout_percentage=0.0,
            )
        }
        service = FeatureFlagService(flags=flags)
        for i in range(20):
            assert service.is_enabled_for("PCT_0", f"user-{i}") is False

    def test_hundred_percentage_returns_true(self, svc):
        """[Red→Green] 100% 롤아웃 플래그는 항상 True"""
        flags = {
            "PCT_100": FeatureFlag(
                name="PCT_100",
                description="100% 롤아웃",
                enabled=True,
                strategy=RolloutStrategy.PERCENTAGE,
                rollout_percentage=100.0,
            )
        }
        service = FeatureFlagService(flags=flags)
        for i in range(20):
            assert service.is_enabled_for("PCT_100", f"user-{i}") is True


# ── TDD 핵심 기능 3: 허용 목록 전략 ─────────────────────────
class TestAllowlistStrategy:
    def test_listed_user_gets_access(self, svc):
        """[Red→Green] 허용 목록 사용자는 True"""
        assert svc.is_enabled_for("ALLOWLIST", "user-alpha") is True
        assert svc.is_enabled_for("ALLOWLIST", "user-beta") is True

    def test_unlisted_user_denied(self, svc):
        """[Red→Green] 목록에 없는 사용자는 False"""
        assert svc.is_enabled_for("ALLOWLIST", "user-gamma") is False
        assert svc.is_enabled_for("ALLOWLIST", "") is False

    def test_disabled_allowlist_returns_false(self, svc):
        """[Red→Green] 비활성화된 허용 목록 플래그는 목록 사용자도 False"""
        flags = {
            "DISABLED_ALLOWLIST": FeatureFlag(
                name="DISABLED_ALLOWLIST",
                description="비활성 허용 목록",
                enabled=False,
                strategy=RolloutStrategy.ALLOWLIST,
                allowlist=["user-alpha"],
            )
        }
        service = FeatureFlagService(flags=flags)
        assert service.is_enabled_for("DISABLED_ALLOWLIST", "user-alpha") is False


# ── TDD 핵심 기능 4: 런타임 오버라이드 ──────────────────────
class TestRuntimeOverride:
    def test_override_enables_flag(self, svc):
        """[Red→Green] 런타임 오버라이드로 비활성 플래그 활성화"""
        assert svc.is_enabled("ALWAYS_OFF") is False
        svc.override("ALWAYS_OFF", True)
        assert svc.is_enabled("ALWAYS_OFF") is True

    def test_override_disables_flag(self, svc):
        """[Red→Green] 런타임 오버라이드로 활성 플래그 비활성화"""
        assert svc.is_enabled("ALWAYS_ON") is True
        svc.override("ALWAYS_ON", False)
        assert svc.is_enabled("ALWAYS_ON") is False


# ── TDD 핵심 기능 5: 전체 플래그 조회 ───────────────────────
class TestGetAllFlags:
    def test_returns_all_flag_names(self, svc):
        """[Red→Green] get_all_flags는 모든 플래그를 반환"""
        all_flags = svc.get_all_flags()
        assert "ALWAYS_ON" in all_flags
        assert "ALWAYS_OFF" in all_flags

    def test_flag_data_structure(self, svc):
        """[Red→Green] 각 플래그는 필수 필드를 포함"""
        all_flags = svc.get_all_flags()
        for _, flag_data in all_flags.items():
            assert "enabled" in flag_data
            assert "description" in flag_data
            assert "strategy" in flag_data


if __name__ == "__main__":
    raise SystemExit(pytest.main([__file__, "-v", "--tb=short"]))
