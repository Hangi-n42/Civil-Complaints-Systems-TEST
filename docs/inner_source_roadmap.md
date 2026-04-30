# Inner Source 도입 로드맵 (Inner Source Adoption Roadmap)

**작성일:** 2026-04-30  
**프로젝트:** Civil-Complaints-Systems-TEST  
**목표:** 조직 내부 공개 개발 문화 수립 및 재사용성 극대화

---

## 1. Inner Source 개요

### 1.1 정의
Inner Source는 오픈소스 개발 방식(협력, 투명성, 커뮤니티 기반)을 조직 내부에 적용하는 소프트웨어 개발 모델입니다.

### 1.2 추진 목표

| 목표 | 기간 | KPI |
|------|------|-----|
| **거버넌스 수립** | Phase 1 (2주) | LICENSE, CONTRIBUTING, CoC 완성 |
| **내부 저장소 공개** | Phase 2 (2주) | 엔티니어 50% 이상 접근 권한 획득 |
| **크로스팀 협력** | Phase 3 (2주) | 타 팀 PR 10건 이상 생성 |
| **메트릭 기반 최적화** | Phase 4 (2주) | DORA 메트릭 5% 개선 |

### 1.3 기대 효과

- 👥 **협력 증대:** 팀 간 코드 재사용 및 피드백 자동화
- 📚 **문서화:** 지식 공개로 인한 암묵적 지식 명시화
- 🚀 **개발 속도:** 중복 개발 제거 → Lead Time 단축
- 🎓 **학습 기회:** 코드 리뷰를 통한 팀 전체 성장
- 📊 **투명성:** 릴리스/배포 현황 가시화

---

## 2. 4단계 추진 계획

### Phase 1: 거버넌스 수립 (Week 1-2)

**목표:** OSS 기본 구조 구축으로 조직 내 공개 개발 규칙 정의

**주요 산출물:**
- [x] LICENSE 파일 (MIT) ✅ 완료
- [x] CONTRIBUTING.md ✅ 완료
- [x] CODE_OF_CONDUCT.md ✅ 완료
- [ ] DCO (Developer Certificate of Origin) 또는 CLA (Contributor License Agreement) 계획

**실행 항목:**

| 항목 | 담당 | 기한 | 상태 |
|------|------|------|------|
| 조직 정책 검토회의 | Steward | Day 1 | 예정 |
| LICENSE 선택 및 배포 | Steward | Day 2 | ✅ 완료 |
| CONTRIBUTING 가이드 작성 | Maintainer | Day 3-4 | ✅ 완료 |
| CODE_OF_CONDUCT 배포 | Steward | Day 5 | ✅ 완료 |
| 라이선스 설명회 (전사) | Steward | Day 7 | 예정 |
| 자동 감사 도구 설정 | DevOps | Day 10 | 예정 |

**체크리스트:**
- [ ] README에 LICENSE 링크 추가
- [ ] 기여 워크플로우 온보딩 영상 제작
- [ ] 라이선스 FAQ 문서 작성

**완료 기준:**
- 모든 엔지니어가 기여 규칙 인지
- CONTRIBUTING.md를 통한 최소 2건 이상 PR 생성

---

### Phase 2: 저장소 공개 (Week 3-4)

**목표:** 조직 내 모든 엔지니어가 저장소 접근 가능하도록 권한 체계 구축

**권한 모델:**

```
Organization GitHub
├── Developers (팀원)
│   ├── 읽기 권한: 모든 저장소
│   ├── 쓰기 권한: feature/* 브랜치만
│   └── 능력: PR 작성, Issues 생성
├── Maintainers (팀장)
│   ├── 읽기/쓰기: 모든 저장소
│   ├── 능력: PR 검토, 병합, 릴리스
│   └── 책임: 코드 품질 관리
└── Stewards (프로젝트 리더)
    ├── 능력: 정책 수립, 릴리스 관리
    └── 책임: 전략/거버넌스
```

**실행 항목:**

| 항목 | 담당 | 기한 | 상태 |
|------|------|------|------|
| 저장소 가시성 설정 변경 (Private → Internal) | DevOps | Day 1 | 예정 |
| GitHub Organization Teams 생성 | DevOps | Day 2 | 예정 |
| 팀별 권한 설정 | Steward | Day 3-4 | 예정 |
| 온보딩 문서 작성 | Maintainer | Day 5-6 | 예정 |
| 팀원 온보딩 (소수 파일럿) | Maintainer | Day 7-10 | 예정 |

**접근 권한 전개:**

```
Week 1: BE1 팀 (파일럿)           → 3명
        테스트 및 피드백
Week 2: FE + BE2 팀 추가          → +5명
        크로스팀 협력 시작
Week 3: BE3 팀 + 주변 팀 추가     → +8명
Week 4: 전사 엔지니어 공개         → 총 20명
```

**체크리스트:**
- [ ] GitHub Organization 멤버십 확인
- [ ] Teams 기반 CODEOWNERS 설정 (자동 리뷰 요청)
- [ ] SSH/Personal Access Token 발급 가이드 제공
- [ ] 2FA (Two-Factor Authentication) 강제

**완료 기준:**
- 모든 팀원이 저장소 access 완료
- 최소 3개 팀에서 PR 생성 시작

---

### Phase 3: 크로스팀 협력 강화 (Week 5-6)

**목표:** 조직 간 코드 재사용 및 peer review 문화 정착

**주요 활동:**

#### 3.1 RFC (Request for Comments) 프로세스 운영

```
API 설계 또는 주요 기능 변경 시:
1. RFC 문서 작성 (docs/rfc-template.md 사용)
2. GitHub Discussions에서 공개 의견 수집 (최소 5일)
3. Architecture Review Board 검토
4. 결정 및 구현 진행
```

**예시 RFC:**
- "Retrieval 모듈 비동기 처리 아키텍처"
- "ChromaDB → Pinecone 마이그레이션 계획"

#### 3.2 코드 리뷰 활성화

| 지표 | 목표 | 측정 방법 |
|------|------|---------|
| **평균 리뷰 시간** | < 24시간 | GitHub Insights |
| **리뷰 댓글 비율** | 20% (MUST), 50% (SHOULD) | PR 통계 |
| **크로스팀 리뷰** | 30% 이상 | 리뷰어 팀 추적 |
| **동의 없는 병합** | 0건 | Pull Request 규칙 |

**리뷰 체크리스트 자동화:**
```yaml
# .github/pull_request_template.md 추가 체크리스트
- [ ] Conventional Commits 준수
- [ ] 테스트 커버리지 70% 이상
- [ ] 주요 설계 변경 시 ADR 작성
- [ ] DORA 메트릭 영향도 검토
```

#### 3.3 코드 소유권 (CODEOWNERS) 정의

```text
# .github/CODEOWNERS

# Retrieval Team
app/retrieval/          @team-be2
docs/20_domains/retrieval/  @team-be2

# Structuring Team
app/structuring/        @team-be1
scripts/evaluate_structuring.py  @team-be1

# API Team
app/api/                @team-be3
docs/10_contracts/api/  @team-be3

# UI Team
frontend/               @team-fe
ui/                     @team-fe
```

**실행 항목:**

| 항목 | 담당 | 기한 | 상태 |
|------|------|------|------|
| RFC 운영 규칙 수립 | Steward | Day 1-2 | 예정 |
| Discussions 카테고리 설정 | Maintainer | Day 3 | 예정 |
| CODEOWNERS 파일 작성 | Steward | Day 4 | 예정 |
| 크로스팀 리뷰 시작 (의무) | All Teams | Day 5+ | 예정 |
| RFC 토론 1건 이상 운영 | Team Lead | Day 7-10 | 예정 |

**체크리스트:**
- [ ] GitHub Discussions 활성화 및 카테고리 생성 (RFC, Q&A, Announcements)
- [ ] RFC 템플릿 확정 및 공유
- [ ] 자동 리뷰 요청 설정 (CODEOWNERS 기반)
- [ ] Slack/Email 알림 연동 (중요 RFC 안내)

**완료 기준:**
- RFC 1건 이상 결론 도출
- 모든 팀에서 크로스팀 PR 검토 경험

---

### Phase 4: 메트릭 기반 최적화 (Week 7-8)

**목표:** DORA 메트릭으로 Inner Source 효과 측정 및 개선

#### 4.1 DORA 메트릭 기반 효과 측정

**측정 대상:**

| 메트릭 | Phase 0 (현재) | Phase 4 목표 | 개선도 |
|--------|----------------|-------------|---------|
| **Lead Time (시간)** | 0.14 | < 0.12 | 14% ↓ |
| **Deployment Frequency** | 0.14/day | > 0.2/day | 43% ↑ |
| **MTTR (시간)** | N/A | < 1 | - |
| **Change Failure Rate** | 0% | < 5% | 관리 |

#### 4.2 내부 운영 메트릭

```
팀별 협력도:
├── PR 생성 (팀당 주간)
│   ├── Phase 2 목표: 1건/팀
│   └── Phase 4 목표: 5건/팀 (4주 평균)
├── 크로스팀 리뷰 비율
│   ├── Phase 3 목표: 30%
│   └── Phase 4 목표: 50% 이상
├── 이슈 해결 시간
│   ├── 평균 시간: < 5일
│   └── 중대 이슈: < 1일
└── 기여자 다양성
    ├── 기여 팀 수: 최소 3팀
    └── 기여자 수: 최소 10명 이상
```

#### 4.3 피드백 및 개선 루프

**월간 리뷰 (회의 1시간):**
1. DORA 메트릭 대시보드 검토
2. 상위 3개 저해 요인 분석
3. 개선 방안 수립 (4주 단위)
4. 다음 달 KPI 설정

**예시 개선 액션:**
- "평균 리뷰 시간 24시간 초과 → 리뷰어 시간 배정"
- "크로스팀 리뷰 부족 → CODEOWNERS 재설정 및 자동 요청"
- "Lead Time 단축 안 됨 → 테스트 자동화 강화"

**실행 항목:**

| 항목 | 담당 | 기한 | 상태 |
|------|------|------|------|
| DORA 대시보드 설정 | DevOps | Day 1 | 예정 |
| 월간 리뷰 회의 정례화 | Steward | Day 2 | 예정 |
| 팀별 성과 공유 | All | 매주 금 | 예정 |
| 개선 액션 플랜 수립 | Team Leads | 월 1회 | 예정 |

**체크리스트:**
- [ ] GitHub Insights 대시보드 구성
- [ ] Grafana/Datadog 연동 (선택사항)
- [ ] 월간 리뷰 템플릿 작성
- [ ] 성과 피드백 메커니즘 수립

**완료 기준:**
- DORA 메트릭 5% 이상 개선 달성
- 팀별 collaborator 평균 3명 이상

---

## 3. 위험 관리 및 완화 전략

### 3.1 주요 위험 요소

| 위험 | 영향 | 확률 | 완화 전략 |
|------|------|------|----------|
| **저항감 (문화 변화)** | 높음 | 높음 | Leadership 주도 + 점진적 확대 (파일럿) |
| **보안 이슈** | 높음 | 중간 | Code review 강화 + Secret scanning 자동화 |
| **의존성 침해** | 중간 | 중간 | License compliance 도구 + 정기 감사 |
| **과부하 (리뷰)** | 중간 | 중간 | 자동 리뷰 요청 + 온콜 로테이션 |
| **품질 저하** | 중간 | 낮음 | CI/CD 강화 + 테스트 커버리지 관리 |

### 3.2 완화 활동

**문화 변화 저항감:**
- 이점 설명 워크숍 (각 팀별 30분)
- "성공 사례" 공유 (Best Practices)
- 초기 기여자 인센티브 (Recognition)

**보안 이슈:**
```bash
# .github/workflows/security.yml
- name: Secret Scanning
  uses: trufflesecurity/trufflehog@main
  
- name: SAST (Static Analysis)
  uses: github/codeql-action/analyze@v2
  
- name: Dependency Check
  uses: dependency-check/Dependency-Check_Action@main
```

---

## 4. 조직 구조 및 역할

### 4.1 Inner Source 조직

```
Executive Sponsor (임원진)
↓
Inner Source Program Lead (Steward)
├── Architecture Board (3명)
│   ├── Backend Lead
│   ├── Frontend Lead
│   └── DevOps Lead
├── Community Manager
│   ├── Discussions 모니터링
│   ├── RFC 처리
│   └── 온보딩 지원
└── Team Representatives (각 팀)
    ├── Team BE1 Lead
    ├── Team FE Lead
    ├── Team BE2 Lead
    └── Team BE3 Lead
```

### 4.2 역할 정의

| 역할 | 책임 | 시간 투자 |
|------|------|----------|
| **Program Lead** | 전략 수립, 프로세스 정의, 스폰서십 | 20% |
| **Maintainer** | 코드 리뷰, PR 병합, 릴리스 | 15% |
| **Architecture Board** | 설계 검토, RFC 승인 | 10% |
| **Community Manager** | 커뮤니케이션, 온보딩, 문서화 | 30% |
| **Developer** | 기여, 리뷰, 아이디어 제안 | 5% |

---

## 5. 커뮤니케이션 계획

### 5.1 채널별 메시지

| 채널 | 대상 | 빈도 | 내용 |
|------|------|------|------|
| **Slack #inner-source** | 전사 | 매일 | Daily standup, 공지사항 |
| **GitHub Discussions** | 엔지니어 | 주 1회 | RFC 공개 토론, Q&A |
| **월간 타운홀** | 전사 | 월 1회 | 성과 공유, 이니셔티브 소개 |
| **1:1 피드백** | 팀장 | 주 1회 | 개별 상황 파악, 코칭 |

### 5.2 주요 메시지 타임라인

```
Week 1: "Inner Source를 시작합니다" (비전 공유)
        ├─ 왜? (Business Case)
        ├─ 무엇? (정의 및 기대효과)
        └─ 어떻게? (4주 로드맵)

Week 2: "당신도 기여할 수 있습니다" (온보딩)
        ├─ 저장소 접근 권한 부여
        ├─ CONTRIBUTING.md 배포
        └─ "첫 PR 작성하기" 튜토리얼

Week 3: "함께 성장합니다" (크로스팀 협력)
        ├─ RFC 운영 방식 설명
        ├─ 팀 간 리뷰 예시
        └─ 질문 및 피드백 수집

Week 4: "성과를 측정합니다" (메트릭 공유)
        ├─ DORA 대시보드 공개
        ├─ 팀별 기여도 인정
        └─ 다음 단계 소개
```

---

## 6. 성공 기준 및 평가

### 6.1 Go/No-Go 게이트

**Phase 1 완료 (Week 2):**
- ✅ LICENSE, CONTRIBUTING, CoC 배포
- ✅ 전사 인지도 80% 이상

**Phase 2 완료 (Week 4):**
- ✅ 팀별 저장소 접근 권한 100%
- ✅ 초기 기여자 20% 이상

**Phase 3 완료 (Week 6):**
- ✅ 크로스팀 PR 30건 이상
- ✅ RFC 1건 이상 결론
- ✅ 자동 리뷰 요청 작동

**Phase 4 완료 (Week 8):**
- ✅ DORA 메트릭 개선 5% 이상
- ✅ 정기 리뷰 회의 확립
- ✅ 롱텀 계획 수립

### 6.2 장기 목표 (Month 3-6)

- 조직 전체 20+ 명의 정기 기여자 확보
- 대외 오픈소스 프로젝트 공개 (부분 모듈)
- Inner Source 우수사례 발표/공유

---

## 7. 참고 자료

### 7.1 참고 문서
- [GitHub Inner Source 가이드](https://github.com/InnerSourceCommons)
- [InnerSource Commons](https://innersourcecommons.org/)
- [Red Hat Inner Source Guide](https://www.redhat.com/en/resources/inner-source-guide)

### 7.2 모니터링 도구
- GitHub Insights (기본)
- Grafana (고급 대시보드)
- GitHub CLI (자동화)

### 7.3 관련 문서
- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md)
- [ADR 템플릿](./adr/template.md)
- [RFC 템플릿](./rfc-template.md)

---

**마지막 업데이트:** 2026-04-30  
**문서 ID:** INNER-SOURCE-ROADMAP-001  
**상태:** 활성 (Phase 1 진행 중)
