#!/usr/bin/env python3
"""
[13주차 선택] 실험 이벤트 로그 → 주간 리포트 마크다운 생성
"""

import argparse
import json
from collections import defaultdict
from datetime import datetime, timedelta, timezone
from pathlib import Path


def load_events(log_file: str) -> list[dict]:
    path = Path(log_file)
    if not path.exists():
        return []
    events = []
    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                try:
                    events.append(json.loads(line))
                except json.JSONDecodeError:
                    continue
    return events


def summarize_experiment(events: list[dict], exp_name: str, week_start: datetime) -> dict:
    week_end = week_start + timedelta(days=7)

    # 이번 주 이벤트만 필터
    week_events = [
        e for e in events
        if e.get("experiment") == exp_name
        and week_start.timestamp() <= e.get("timestamp", 0) < week_end.timestamp()
    ]

    by_variant: dict = defaultdict(lambda: {"assignments": set(), "conversions": 0, "values": []})
    for e in week_events:
        v = e.get("variant", "unknown")
        if e.get("event_type") == "assignment":
            by_variant[v]["assignments"].add(e.get("user_id", ""))
        elif e.get("event_type") == "conversion":
            by_variant[v]["conversions"] += 1
        if e.get("value") is not None:
            by_variant[v]["values"].append(e["value"])

    result = {}
    for variant, data in by_variant.items():
        n = len(data["assignments"])
        result[variant] = {
            "users": n,
            "conversions": data["conversions"],
            "conversion_rate": round(data["conversions"] / n * 100, 1) if n else 0,
            "avg_value": round(sum(data["values"]) / len(data["values"]), 2) if data["values"] else 0,
        }
    return result


def generate_report(log_file: str, week_number: int) -> str:
    events = load_events(log_file)
    now = datetime.now(timezone(timedelta(hours=9)))  # KST
    # 이번 주 시작 (월요일 00:00 KST)
    week_start = now - timedelta(days=now.weekday(), hours=now.hour, minutes=now.minute, seconds=now.second)

    experiments = ["RAG_STRATEGY", "SEARCH_RANKING"]
    lines = [
        f"## 📊 {week_number}주차 실험 리포트\n",
        f"**기간**: {week_start.strftime('%Y-%m-%d')} ~ {(week_start + timedelta(days=6)).strftime('%Y-%m-%d')}\n",
        f"**생성 시각**: {now.strftime('%Y-%m-%d %H:%M')} KST\n",
    ]

    for exp in experiments:
        summary = summarize_experiment(events, exp, week_start)
        lines.append(f"\n### 실험: `{exp}`\n")
        if not summary:
            lines.append("> 이번 주 이벤트 데이터 없음\n")
            continue
        lines.append("| Variant | 사용자 | 전환 | 전환율 | 평균값 |")
        lines.append("|---------|--------|------|--------|--------|")
        for variant, data in summary.items():
            lines.append(
                f"| {variant} | {data['users']} | {data['conversions']} | "
                f"{data['conversion_rate']}% | {data['avg_value']} |"
            )

    lines.append("\n### 주요 인사이트\n")
    if not events:
        lines.append("- 아직 이벤트 데이터가 수집되지 않았습니다.\n")
        lines.append("- Feature Flag를 활성화하고 사용자 트래픽을 생성하세요.\n")
    else:
        lines.append(f"- 총 이벤트 수: {len(events)}개\n")
        exps = {e["experiment"] for e in events}
        lines.append(f"- 활성 실험: {', '.join(exps)}\n")

    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description="주간 실험 리포트 생성")
    parser.add_argument("--log-file", default="logs/ab_test_events.jsonl")
    parser.add_argument("--output", default="/tmp/weekly_report.md")
    parser.add_argument("--week", type=int, default=1)
    args = parser.parse_args()

    report = generate_report(args.log_file, args.week)
    Path(args.output).parent.mkdir(parents=True, exist_ok=True)
    Path(args.output).write_text(report, encoding="utf-8")
    print(f"리포트 생성 완료: {args.output}")
    print(report)


if __name__ == "__main__":
    main()
