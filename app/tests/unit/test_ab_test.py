"""
[12주차] A/B 테스트 시스템 TDD 테스트
"""

import json
import sys
import tempfile
from pathlib import Path

import pytest

PROJECT_ROOT = Path(__file__).resolve().parents[3]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from app.core.ab_test import ABTestService, Experiment, Variant


@pytest.fixture
def svc(tmp_path):
    """임시 로그 파일을 사용하는 테스트용 A/B 서비스"""
    experiments = {
        "TEST_EXP": Experiment(
            name="TEST_EXP",
            description="테스트 실험",
            active=True,
            control_weight=50.0,
        ),
        "INACTIVE_EXP": Experiment(
            name="INACTIVE_EXP",
            description="비활성 실험",
            active=False,
        ),
    }
    return ABTestService(
        experiments=experiments,
        event_log_path=tmp_path / "test_events.jsonl",
    )


class TestVariantAssignment:
    def test_consistent_assignment(self, svc):
        """같은 user_id는 항상 같은 variant"""
        v1 = svc.assign("TEST_EXP", "user-abc")
        v2 = svc.assign("TEST_EXP", "user-abc")
        assert v1 == v2

    def test_inactive_experiment_returns_control(self, svc):
        """비활성 실험은 항상 control 반환"""
        for i in range(10):
            assert svc.assign("INACTIVE_EXP", f"user-{i}") == Variant.CONTROL

    def test_unknown_experiment_returns_control(self, svc):
        """알 수 없는 실험은 control 반환"""
        assert svc.assign("NONEXISTENT", "user-x") == Variant.CONTROL

    def test_both_variants_assigned(self, svc):
        """50/50 실험에서 두 variant 모두 할당"""
        variants = {svc.assign("TEST_EXP", f"user-{i}") for i in range(100)}
        assert Variant.CONTROL in variants
        assert Variant.TREATMENT in variants


class TestEventTracking:
    def test_assignment_event_logged(self, svc, tmp_path):
        """할당 이벤트가 JSONL 파일에 기록됨"""
        svc.assign("TEST_EXP", "user-log-test")
        log_file = tmp_path / "test_events.jsonl"
        assert log_file.exists()
        lines = log_file.read_text().strip().split("\n")
        events = [json.loads(l) for l in lines if l]
        assignment_events = [e for e in events if e["event_type"] == "assignment"]
        assert len(assignment_events) >= 1

    def test_track_conversion(self, svc, tmp_path):
        """전환 이벤트 추적"""
        svc.track("TEST_EXP", "user-convert", "conversion", value=1.0)
        log_file = tmp_path / "test_events.jsonl"
        events = [json.loads(l) for l in log_file.read_text().strip().split("\n") if l]
        conversions = [e for e in events if e["event_type"] == "conversion"]
        assert len(conversions) >= 1
        assert conversions[-1]["value"] == 1.0


class TestResultsSummary:
    def test_empty_experiment_returns_error(self, svc):
        """이벤트 없는 실험은 error 키 포함"""
        result = svc.get_results_summary("NONEXISTENT")
        assert "error" in result

    def test_summary_has_both_variants(self, svc):
        """요약에 두 variant 포함"""
        for i in range(20):
            svc.assign("TEST_EXP", f"user-{i}")
        result = svc.get_results_summary("TEST_EXP")
        assert "control" in result["variants"]
        assert "treatment" in result["variants"]


if __name__ == "__main__":
    raise SystemExit(pytest.main([__file__, "-v"]))
