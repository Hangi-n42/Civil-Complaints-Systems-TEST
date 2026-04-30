# OSS 라이선스 비교 분석 (OSS License Comparison Analysis)

**작성일:** 2026-04-30  
**프로젝트:** Civil-Complaints-Systems-TEST  
**결정:** MIT 라이선스 채택

## 1. 라이선스 선택 개요

Civil-Complaints-Systems는 공공 데이터 기반의 LLM 시스템으로, 다음 기준에 따라 **MIT 라이선스**를 채택했습니다:

- **개발 유연성:** 조직 내부 적용 시 상용화/수정 자유도 필요
- **호환성:** 기존 의존성(FastAPI, Streamlit, ChromaDB 등)의 대부분이 MIT/Apache 기반
- **관리 간편성:** 간단한 라이선스 text + 저작권 표기로 충분
- **커뮤니티 채택:** 오픈소스/Inner Source 모두에 적합

## 2. 주요 OSS 라이선스 비교

### 2.1 비교 매트릭스

| 항목 | MIT | Apache 2.0 | GPL 3.0 | AGPL 3.0 | ISC |
|------|-----|-----------|---------|----------|-----|
| **허용도** | 최고 | 높음 | 낮음 | 매우 낮음 | 최고 |
| **상업 이용** | ✅ | ✅ | ✅* | ✅* | ✅ |
| **수정/파생** | ✅ | ✅ | ✅† | ✅† | ✅ |
| **배포** | ✅ | ✅ | ✅† | ✅† | ✅ |
| **서버 실행** | ✅ | ✅ | ✅ | ❌‡ | ✅ |
| **특허 보호** | ❌ | ✅ | ❌ | ❌ | ❌ |
| **저작권 표기** | 필수 | 필수 | 필수 | 필수 | 필수 |
| **라이선스 공개** | ❌ | ❌ | ✅ | ✅ | ❌ |
| **소스 공개** | ❌ | ❌ | ✅ | ✅ | ❌ |
| **조건부 의무** | 최소 | 중간 | 높음 | 최고 | 최소 |

**범례:**
- `*` 파생물도 동일 라이선스 명시 필수
- `†` 강한 copyleft 규정 (파생물도 GPL/AGPL 적용)
- `‡` Network Copyleft: 서버 실행도 소스 공개 필요

### 2.2 상세 비교

#### MIT License
**특징:**
- 가장 간단하고 관대한 라이선스
- 저작권 및 라이선스 공지만 요구
- 상용화, 수정, 배포 모두 자유
- 특허 보호 규정 없음

**사용 예:**
- Node.js, Rails, jQuery, Axios, Lodash
- Streamlit, FastAPI 일부 모듈

**장점:**
- 이해하기 쉬움
- 상업적 활용 자유로움
- Inner Source 확장에 최적

**단점:**
- 특허 보호 없음
- 기여자 보호 약함

**적합 대상:** 오픈소스 + Inner Source 동시 운영

---

#### Apache License 2.0
**특징:**
- MIT보다 상세한 조건 규정
- 명시적 특허 보호 (Patent Grant)
- 수정 사항 표기 요구
- 상용화, 수정, 배포 자유

**사용 예:**
- Kubernetes, Cassandra, Hadoop, Spark, OpenStack

**장점:**
- 특허 분쟁으로부터 보호
- 대규모 엔터프라이즈 프로젝트 표준
- 명확한 법적 프레임워크

**단점:**
- 문서가 길고 복잡
- 작은 프로젝트에는 과할 수 있음

**적합 대상:** 대규모 엔터프라이즈, 특허 고려 필요 시

---

#### GPL v3.0
**특징:**
- 강한 copyleft: 파생물도 GPL 적용 필수
- 소스 코드 공개 의무
- 상업 이용 가능하지만 소스 공개 필수

**사용 예:**
- Linux Kernel, Git, GNU Emacs, MariaDB

**장점:**
- 커뮤니티 자산 보호
- 강한 소스 공개 의무로 혁신 촉진

**단점:**
- 상용 프로젝트 적용 어려움
- 내부 사용도 소스 공개 압력
- 상업적 확장성 제한

**적합 대상:** 순수 오픈소스, 상용화 불필요 시

---

#### AGPL v3.0
**특징:**
- GPL의 강화판 (Network Copyleft)
- **서버 실행도 소스 공개 필수** (SaaS 운영 시)
- 클라우드/웹 서비스도 코드 공개 의무

**사용 예:**
- MongoDB (초기), Gitlab Community Edition, Nextcloud

**장점:**
- 클라우드 비즈니스 모델에서 공평성 보장

**단점:**
- 가장 제한적 (SaaS 기업에 부담)
- 채택도 낮음

**적합 대상:** 순수 오픈소스, 상용 SaaS 프로젝트 미고려

---

#### ISC License
**특징:**
- MIT과 유사한 매우 간단한 라이선스
- 거의 사용되지 않음

**사용 예:**
- Node.js (일부 모듈)

**장점:**
- 매우 간단

**단점:**
- 채택 커뮤니티 작음

**적합 대상:** 특별한 이유 없으면 MIT/Apache 추천

---

## 3. Civil-Complaints-Systems 라이선스 선택 사유

### 3.1 선택: **MIT License**

### 3.2 의사결정 기준

| 기준 | 중요도 | MIT | Apache | GPL | AGPL |
|------|--------|-----|--------|-----|------|
| 상용화/배포 자유도 | ⭐⭐⭐⭐⭐ | ✅ | ✅ | ❌ | ❌ |
| Inner Source 호환성 | ⭐⭐⭐⭐ | ✅ | ✅ | ❌ | ❌ |
| 의존성 호환성 | ⭐⭐⭐ | ✅ | ✅ | ⚠️ | ❌ |
| 문서/관리 간편성 | ⭐⭐ | ✅ | ⚠️ | ❌ | ❌ |
| 커뮤니티 채택 | ⭐⭐ | ✅ | ✅ | ✅ | ⚠️ |

### 3.3 의존성 라이선스 호환성

```
프로젝트 스택:
├── Backend
│   ├── FastAPI → BSD (호환 ✅)
│   ├── Ollama → MIT (호환 ✅)
│   ├── ChromaDB → Apache 2.0 (호환 ✅)
│   ├── SQLAlchemy → MIT (호환 ✅)
│   └── Pydantic → MIT (호환 ✅)
├── Frontend
│   ├── Next.js → MIT (호환 ✅)
│   ├── React → MIT (호환 ✅)
│   └── TailwindCSS → MIT (호환 ✅)
└── DevOps
    ├── GitHub Actions → Proprietary (호환 ✅)
    └── Node.js → MIT (호환 ✅)
```

**결론:** 모든 주요 의존성이 MIT 또는 Apache 라이선스. GPL 프로젝트 의존성 없음 → MIT 선택 안전

### 3.4 내부 적용 시나리오

**시나리오 1: 조직 내 수정/확장 (Inner Source)**
- MIT: 완벽 지원 ✅
- 조직 정책에 따라 상용화 가능

**시나리오 2: 공공 기관 배포**
- MIT: GPL과 달리 상용 솔루션 포함 가능
- 공공 조달에서 라이선스 분쟁 최소화

**시나리오 3: 제3자 통합**
- MIT: 예제 코드/라이브러리로 활용 최적
- 배포 시 저작권 표기만 필요

## 4. 라이선스 위험 분석

### 4.1 MIT 선택 시 주의사항

| 위험 | 수준 | 대응 |
|------|------|------|
| 특허 침해 보호 없음 | 중간 | Apache 2.0으로 변경 고려 (향후) |
| 상용 기여자 악의적 사용 | 낮음 | 기여자 계약/DCO 강화 |
| 의존성 GPL 혼입 | 낮음 | 의존성 감시 자동화 (npm audit) |

### 4.2 GPL 마이그레이션 전략

미래에 GPL로 변경 필요 시:
1. 현재 사용자/기여자에게 사전 공지
2. 새 메이저 버전부터 적용 (예: v3.0)
3. 이전 릴리스는 MIT 유지

---

## 5. 결론 및 권장사항

### 5.1 최종 결정

**MIT License 채택** — 이유:
1. ✅ 상업적 유연성과 Inner Source 호환성 최적
2. ✅ 모든 주요 의존성과 호환
3. ✅ 공개/내부 사용 모두 지원
4. ✅ 관리 및 이해 간편

### 5.2 권장 추가 조치

1. **DCO (Developer Certificate of Origin) 추가**
   - 기여자가 라이선스 준수 명시
   - 법적 보호 강화

2. **의존성 감시 자동화**
   ```bash
   npm audit  # 매 CI 실행
   pip check  # Python 의존성 확인
   ```

3. **라이선스 호환성 검사 도구 도입**
   - Black Duck, FOSSA, or License Finder

4. **주기적 검토 (연 1회)**
   - 의존성 라이선스 변경 모니터링
   - 필요시 라이선스 업그레이드 검토

### 5.3 참고 자료

- [MIT License Official](https://opensource.org/licenses/MIT)
- [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0)
- [GPL vs MIT vs Apache](https://wiki.debian.org/DFSGLicenses)
- [Choose a License](https://choosealicense.com/)

---

**마지막 업데이트:** 2026-04-30  
**문서 ID:** OSS-LICENSE-ANALYSIS-001
