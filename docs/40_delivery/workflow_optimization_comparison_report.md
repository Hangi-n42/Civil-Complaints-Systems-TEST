# Workflow 실행 최적화 전후 비교 리포트

작성일: 2026-04-30
브랜치: feature/workflow-Optimization
PR: https://github.com/Hangi-n42/Civil-Complaints-Systems-TEST/pull/20

## 1) 최적화 범위

- Reusable Workflow 도입: .github/workflows/reusable-python-lint-test.yml
- Composite Action 도입: .github/actions/python-ci-setup/action.yml
- Matrix 확장: Python 3.11/3.12 x ubuntu/windows/macos (총 6조합)
- 선택적 배포: paths-filter 기반 변경 파일 감지 + 브랜치/이벤트 조건

## 2) 측정 방법

- 동일 커밋(HEAD: feature/workflow-Optimization)에서 workflow_dispatch를 사용
- 실험 A (Before): cache_enabled=false
- 실험 B (After-warm): cache_enabled=true (첫 실행, 캐시 생성)
- 실험 C (After-hit): cache_enabled=true (두 번째 실행, 캐시 hit)
- 총 실행시간은 런 시작~종료 시간 기준

## 3) 실행 링크

- Before (cache=false): https://github.com/Hangi-n42/Civil-Complaints-Systems-TEST/actions/runs/25155372047
- After-warm (cache=true): https://github.com/Hangi-n42/Civil-Complaints-Systems-TEST/actions/runs/25155373903
- After-hit (cache=true): https://github.com/Hangi-n42/Civil-Complaints-Systems-TEST/actions/runs/25155375651

## 4) 결과 요약

실행 완료 후 갱신 예정.

| 구분 | Run ID | 설정 | 총 소요시간(초) | 비고 |
|---|---:|---|---:|---|
| Before | 25155372047 | cache=false | PENDING | 기준값 |
| After-warm | 25155373903 | cache=true | PENDING | 캐시 생성 런 |
| After-hit | 25155375651 | cache=true | PENDING | 캐시 활용 런 |

개선률 공식:

- 개선률(%) = ((Before - After-hit) / Before) x 100

## 5) 선택적 배포 검증

- PR 이벤트: deploy 미실행 (보호)
- main push + deploy 관련 변경 시에만 deploy 실행
- build artifact(optimized-build) 업로드 후 deploy 단계 다운로드 확인

## 6) 결론

측정 완료 후 수치를 반영해 최종 확정 예정.
