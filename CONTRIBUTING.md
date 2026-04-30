# 기여 가이드 (Contributing Guide)

Civil-Complaints-Systems에 기여해주셔서 감사합니다! 이 문서는 프로젝트에 참여하는 방법을 설명합니다.

## 기여자 역할

| 역할 | 책임 | 권한 |
|------|------|------|
| **Reporter** | 이슈 보고, 버그/제안 작성 | Issues 생성 |
| **Contributor** | 코드/문서 제출, PR 작성 | Fork 및 PR 생성 |
| **Maintainer** | PR 검토, 메인 브랜치 병합 | Repository push 권한 |
| **Steward** | 프로젝트 방향 결정, 리뷰 정책 수립 | 모든 권한 + 거버넌스 |

## 브랜치 전략 (Branch Strategy)

- `main`: 보호된 릴리스 브랜치 (CI/CD 필수)
- `feature/<topic>`: 새로운 기능 개발
- `fix/<topic>`: 긴급 버그 수정
- `docs/<topic>`: 문서 전용 변경
- 브랜치명은 짧고 명확하게 유지

## 커밋 형식 (Commit Format)

모든 커밋은 Conventional Commits 형식을 준수합니다:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**타입 종류:**
- `feat`: 새 기능 (user-facing capability)
- `fix`: 버그 수정
- `docs`: 문서 작성/수정
- `test`: 테스트 추가/수정
- `refactor`: 코드 리팩토링 (동작 변화 없음)
- `perf`: 성능 개선
- `chore`: 빌드, 의존성 등 유지보수

**예시:**
```
feat(structuring): add entity extraction for LOCATION type

- Implement regex-based location entity identification
- Add 12 location entity test cases
- Update structuring pipeline documentation

Closes #42
```

한 커밋은 논리적으로 하나의 변경만 포함해야 합니다.

## 개발 환경 설정

### 시스템 요구사항
- Python 3.9+
- Node.js 20+
- Git 2.40+

### 빠른 시작

```bash
# 1. 저장소 Fork 및 Clone
git clone https://github.com/<your-username>/Civil-Complaints-Systems-TEST.git
cd Civil-Complaints-Systems-TEST

# 2. Python 환경 설정
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# 3. 개발 브랜치 생성
git checkout -b feature/issue-123-description
```

## Pull Request 프로세스

### 1단계: 이슈 확인
- [Issues](https://github.com/Hangi-n42/Civil-Complaints-Systems-TEST/issues) 확인
- 유사 이슈 없을 시 새로운 이슈 작성

### 2단계: 코드 작성 및 테스트

**코드 스타일:**
- Python: PEP 8 준수 (최대 100자 라인)
- 주석: 영문 또는 한글 (일관성 유지)

```bash
# 테스트 실행
pytest app/tests/ -v

# 코드 스타일 검증
pylint app/
```

### 3단계: Pull Request 작성

1. GitHub에서 PR 생성 (PR 템플릿 사용)
2. 관련 이슈 링크 (`Closes #<issue-number>`)
3. 변경 사항 상세 설명
4. 체크리스트 항목 확인

### 4단계: 코드 리뷰

**Maintainer의 리뷰:**
- 48시간 이내 피드백
- `[MUST]`: 필수 수정 (정확성, 요구사항)
- `[SHOULD]`: 권장 개선 (품질, 가독성)
- 최소 1명의 approve 후 병합

**리뷰 체크리스트:**
- [ ] Conventional Commits 형식 준수
- [ ] 기존 테스트 통과
- [ ] 신규 코드 테스트 추가 (70% 이상 커버리지)
- [ ] README/문서 업데이트
- [ ] 주요 설계 변경 시 ADR 작성 ([docs/adr/README.md](docs/adr/README.md) 참고)

## 문서 기여

- Markdown 형식 (`docs/` 폴더)
- 명확한 제목과 목차 포함
- 코드 예시는 문법 강조 지원 (```python, ```bash 등)
- 복잡한 설계는 ADR 문서로 작성

## 행동 수칙 (Code of Conduct)

이 프로젝트는 [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)를 준수합니다.
모든 기여자는 서로 존중하는 포용적 환경을 만드는 데 동의합니다.

위반 보고: [Hangi-n42@gmail.com](mailto:Hangi-n42@gmail.com)

## 성과 인정 (Attribution)

- 고정 기여자: README의 "기여자" 섹션 기재
- GitHub 커밋 히스토리 자동 기재
- 정기 릴리스 노트에 감사 표시

## 질문 및 피드백

- 기술 질문: [GitHub Discussions](https://github.com/Hangi-n42/Civil-Complaints-Systems-TEST/discussions)
- 버그 보고: [GitHub Issues](https://github.com/Hangi-n42/Civil-Complaints-Systems-TEST/issues)
- 디자인 제안: [RFC 프로세스](docs/rfc-template.md) 참고

---

**마지막 업데이트:** 2026-04-30

## Definition of Done

- Changes are committed with a Conventional Commit message.
- PR template is completed.
- Review feedback is addressed.
- Relevant docs and tests are updated.
- Branch protection expectations are documented before merge.
