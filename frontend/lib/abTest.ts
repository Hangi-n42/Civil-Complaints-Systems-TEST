/**
 * [11주차] 프론트엔드 A/B 테스트 클라이언트
 * 사용자 할당 일관성 + 이벤트 추적 로직
 */

export type ExperimentName = 'RAG_STRATEGY' | 'SEARCH_RANKING';
export type Variant = 'control' | 'treatment';

interface AssignmentCache {
  [key: string]: Variant;
}

// 메모리 캐시 (세션 내 일관성 유지)
const _cache: AssignmentCache = {};

/**
 * 사용자를 실험 variant에 할당
 * localStorage 기반으로 세션 간 일관성 유지
 */
export function getVariant(experiment: ExperimentName, userId: string): Variant {
  const cacheKey = `${experiment}:${userId}`;

  // 1순위: 메모리 캐시
  if (_cache[cacheKey]) return _cache[cacheKey];

  // 2순위: localStorage (브라우저 환경에서만)
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(`ab_${cacheKey}`);
    if (stored === 'control' || stored === 'treatment') {
      _cache[cacheKey] = stored;
      return stored;
    }
  }

  // 3순위: 해시 기반 신규 할당
  const bucket = hashToBucket(userId, experiment);
  const variant: Variant = bucket < 50 ? 'control' : 'treatment';

  _cache[cacheKey] = variant;
  if (typeof window !== 'undefined') {
    localStorage.setItem(`ab_${cacheKey}`, variant);
  }

  // 할당 이벤트 전송
  trackEvent(experiment, userId, variant, 'assignment');

  return variant;
}

/**
 * A/B 테스트 이벤트 추적
 * 백엔드 API로 이벤트 전송
 */
export async function trackEvent(
  experiment: ExperimentName,
  userId: string,
  variant: Variant,
  eventType: 'assignment' | 'impression' | 'conversion' | 'latency',
  value?: number,
  metadata?: Record<string, unknown>
): Promise<void> {
  const event = {
    experiment,
    variant,
    user_id: userId,
    event_type: eventType,
    value,
    metadata: metadata || {},
    timestamp: Date.now() / 1000,
  };

  // 비동기 전송 (실패해도 UX에 영향 없도록)
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    await fetch(`${apiUrl}/api/v1/ab-test/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
      // 타임아웃: 2초
      signal: AbortSignal.timeout(2000),
    });
  } catch {
    // 이벤트 전송 실패는 조용히 처리 (UX 방해 금지)
    console.debug('[A/B Test] 이벤트 전송 실패 (무시됨)', experiment, eventType);
  }
}

/**
 * React Hook: 실험 variant 사용
 *
 * 사용 예:
 *   const variant = useExperiment('RAG_STRATEGY', userId);
 *   return variant === 'treatment' ? <NewSearch /> : <OldSearch />;
 */
export function useExperimentVariant(
  experiment: ExperimentName,
  userId: string | null | undefined
): Variant {
  if (!userId) return 'control';
  return getVariant(experiment, userId);
}

// 사용자 ID + 실험명 → 0~100 버킷
function hashToBucket(userId: string, experiment: string): number {
  const key = `${experiment}:${userId}`;
  let hash = 5381;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) + hash + key.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash % 10000) / 100;
}
