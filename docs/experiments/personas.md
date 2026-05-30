# 사용자 피드백 수집: 10개 LLM 페르소나 시나리오

> [13주차] LLM으로 생성된 각기 다른 페르소나를 가진 10명의 가상 사용자 시나리오

---

## 실험 설계

- **기간**: 2주 (2026-05-31 ~ 2026-06-13)
- **방법**: 각 페르소나별로 GPT-4o를 사용해 사용자 행동 및 피드백 시뮬레이션
- **A/B 그룹**: 각 페르소나는 `RAG_STRATEGY` 실험의 control/treatment에 50:50 무작위 배정

---

## 페르소나 1 - 고령의 일반 민원인

```yaml
id: persona-01
name: 김영순 (가명)
age: 68
occupation: 주부 (은퇴)
tech_literacy: 낮음 (스마트폰 기본 사용)
variant: control
complaint_type: 도로 파손
scenario: >
  동네 골목 도로에 큰 구멍이 생겨 넘어질 뻔했다. 민원을 넣고 싶은데
  어떻게 써야 할지 모르겠다. 자세한 안내가 필요하다.
feedback:
  satisfaction: 3/5
  comments: "찾는 답을 바로 못 찾겠다. 더 쉽게 설명해줬으면 좋겠다."
  task_completion: true
  response_time_perception: "느리다"
```

## 페르소나 2 - 업무 효율 중시 직장인

```yaml
id: persona-02
name: 박준혁 (가명)
age: 35
occupation: IT 기업 직원
tech_literacy: 높음
variant: treatment
complaint_type: 주차 위반
scenario: >
  퇴근 후 불법 주차 차량 때문에 주차 공간이 없다. 빠르게 신고하고
  처리 상태를 추적하고 싶다.
feedback:
  satisfaction: 4/5
  comments: "검색 결과가 관련성이 높아졌다. 응답 속도 더 빨랐으면."
  task_completion: true
  response_time_perception: "보통"
  conversion: true  # 실제 민원 제출 완료
```

## 페르소나 3 - 환경 의식 높은 MZ세대

```yaml
id: persona-03
name: 이수진 (가명)
age: 24
occupation: 대학원생
tech_literacy: 매우 높음
variant: treatment
complaint_type: 환경 오염 (불법 쓰레기 투기)
scenario: >
  아파트 단지 뒤 공터에 대형 폐기물이 불법 투기됐다. 사진 첨부하고
  위치 정보도 함께 신고하고 싶다.
feedback:
  satisfaction: 5/5
  comments: "RAG 답변이 구체적이고 실용적이었다. 관련 법조문까지 찾아줘서 좋았다."
  task_completion: true
  conversion: true
```

## 페르소나 4 - 소상공인 (정보 접근 제한)

```yaml
id: persona-04
name: 최병철 (가명)
age: 52
occupation: 식당 운영
tech_literacy: 보통
variant: control
complaint_type: 건축 공사 소음
scenario: >
  가게 옆 건물이 새벽부터 공사해서 장사가 안 된다. 공사 허가 기준과
  소음 기준 초과 여부를 알고 싶다.
feedback:
  satisfaction: 3/5
  comments: "답변이 너무 일반적이다. 내 상황에 맞는 구체적인 안내가 필요하다."
  task_completion: false
  pain_point: "유사 사례 검색 결과가 내 케이스와 달라 혼란스러움"
```

## 페르소나 5 - 장애인 (접근성 니즈)

```yaml
id: persona-05
name: 윤미래 (가명)
age: 41
occupation: 재택근무 프리랜서
tech_literacy: 보통
accessibility_needs: [화면 낭독기, 키보드 네비게이션]
variant: control
complaint_type: 보도블록 파손 (휠체어 이동 어려움)
scenario: >
  집 앞 보도블록이 들려 있어 전동휠체어 이동이 위험하다. 빠른 처리가
  필요하며 접근성 지원이 필요하다.
feedback:
  satisfaction: 2/5
  comments: "화면 낭독기에서 검색 결과 구조가 불명확하다. 접근성 개선 필요."
  accessibility_issue: true
  task_completion: true
```

## 페르소나 6 - 반복 민원인 (이력 중시)

```yaml
id: persona-06
name: 강동훈 (가명)
age: 47
occupation: 자영업
tech_literacy: 보통
variant: treatment
complaint_type: 반복 침수 (집 앞 하수도 역류)
scenario: >
  작년에도 같은 문제로 민원을 넣었는데 해결이 안 됐다. 이번에는
  이전 민원 이력을 참조해서 더 강력하게 처리 요청하고 싶다.
feedback:
  satisfaction: 4/5
  comments: "이전 민원 관련 정보 연결이 좋았다. 처리 이력 추적이 쉬워졌다."
  task_completion: true
  conversion: true
```

## 페르소나 7 - 외국인 거주자 (언어 장벽)

```yaml
id: persona-07
name: Zhang Wei (가명)
age: 31
occupation: 주재원
tech_literacy: 높음
language: 중국어 모국어, 한국어 중급
variant: treatment
complaint_type: 쓰레기 분리수거 규정 문의
scenario: >
  분리수거 규정이 한국어로만 되어 있어 헷갈린다. 영어나 중국어로
  안내받고 싶다.
feedback:
  satisfaction: 3/5
  comments: "한국어 답변만 제공돼서 이해하기 어렵다. 다국어 지원이 필요하다."
  task_completion: true
  feature_request: "다국어 지원"
```

## 페르소나 8 - 공무원 내부 사용자

```yaml
id: persona-08
name: 홍기현 (가명)
age: 38
occupation: 시청 민원담당 공무원
tech_literacy: 높음
variant: control
use_case: 유사 민원 사례 검색 및 처리 방침 확인
scenario: >
  하루에 50건 이상 민원을 처리해야 한다. 유사 사례를 빠르게 찾고
  처리 방침 근거를 제시해야 한다.
feedback:
  satisfaction: 4/5
  comments: "업무 시간이 30% 단축됐다. 법령 근거 자동 추출이 특히 유용하다."
  task_completion: true
  efficiency_gain: "30% 시간 절감"
```

## 페르소나 9 - 어린 자녀를 둔 학부모

```yaml
id: persona-09
name: 서은지 (가명)
age: 33
occupation: 육아 중
tech_literacy: 보통
variant: treatment
complaint_type: 어린이 통학로 안전 (불법 주정차)
scenario: >
  아이 학교 앞 불법 주정차로 등하교 시 위험하다. 학교 측, 경찰서,
  구청 중 어디에 신고해야 하는지 모르겠다.
feedback:
  satisfaction: 5/5
  comments: "어디에 신고해야 하는지 정확히 안내받았다. 관련 기관 연락처까지 알려줘서 바로 해결했다."
  task_completion: true
  conversion: true
```

## 페르소나 10 - 디지털 네이티브 청년

```yaml
id: persona-10
name: 임도현 (가명)
age: 19
occupation: 대학생
tech_literacy: 매우 높음
variant: control
complaint_type: 공원 시설물 파손
scenario: >
  동네 공원 운동기구가 파손돼 있다. SNS 공유하기 전에 공식 민원을
  넣어보려 한다. 앱이 느리면 바로 이탈한다.
feedback:
  satisfaction: 2/5
  comments: "UI가 구식이다. 모바일 최적화가 안 돼 있고 응답이 느리다."
  task_completion: false
  pain_point: "응답 속도 및 모바일 UX"
  churn: true
```

---

## 피드백 집계 (A/B 실험 연동)

| 페르소나 | Variant | 만족도 | 완료율 | 전환 |
|---------|---------|--------|--------|------|
| 01 - 고령 민원인 | control | 3/5 | ✅ | ❌ |
| 02 - IT 직장인 | treatment | 4/5 | ✅ | ✅ |
| 03 - MZ세대 | treatment | 5/5 | ✅ | ✅ |
| 04 - 소상공인 | control | 3/5 | ❌ | ❌ |
| 05 - 장애인 | control | 2/5 | ✅ | ❌ |
| 06 - 반복 민원 | treatment | 4/5 | ✅ | ✅ |
| 07 - 외국인 | treatment | 3/5 | ✅ | ❌ |
| 08 - 공무원 | control | 4/5 | ✅ | ❌ |
| 09 - 학부모 | treatment | 5/5 | ✅ | ✅ |
| 10 - 청년 | control | 2/5 | ❌ | ❌ |

**평균 만족도**:
- Control: (3+3+2+4+2)/5 = **2.8/5**
- Treatment: (4+5+4+3+5)/5 = **4.2/5**

**완료율**:
- Control: 4/5 = **80%**
- Treatment: 5/5 = **100%**

**전환율** (민원 실제 제출):
- Control: 0/5 = **0%**
- Treatment: 4/5 = **80%**
