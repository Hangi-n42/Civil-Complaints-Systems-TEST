/**
 * [11주차] 프론트엔드 Feature Flag 시스템
 * 환경 변수 (NEXT_PUBLIC_FF_*) 기반 플래그 토글
 */

export type FlagName =
  | 'ENHANCED_RAG'
  | 'NEW_SEARCH_UI'
  | 'EXPERIMENTAL_LLM'
  | 'AUTO_PII_MASKING'
  | 'ENHANCED_ENTITY_EXTRACTION';

interface FlagConfig {
  description: string;
  defaultValue: boolean;
  envKey: string;
}

// 플래그 정의 (환경 변수 키 매핑)
const FLAG_CONFIGS: Record<FlagName, FlagConfig> = {
  ENHANCED_RAG: {
    description: '개선된 RAG 파이프라인',
    defaultValue: false,
    envKey: 'NEXT_PUBLIC_FF_ENHANCED_RAG',
  },
  NEW_SEARCH_UI: {
    description: '새로운 검색 인터페이스',
    defaultValue: false,
    envKey: 'NEXT_PUBLIC_FF_NEW_SEARCH_UI',
  },
  EXPERIMENTAL_LLM: {
    description: '실험적 LLM 모델',
    defaultValue: false,
    envKey: 'NEXT_PUBLIC_FF_EXPERIMENTAL_LLM',
  },
  AUTO_PII_MASKING: {
    description: 'PII 자동 마스킹',
    defaultValue: true,
    envKey: 'NEXT_PUBLIC_FF_AUTO_PII_MASKING',
  },
  ENHANCED_ENTITY_EXTRACTION: {
    description: '강화된 엔티티 추출',
    defaultValue: false,
    envKey: 'NEXT_PUBLIC_FF_ENHANCED_ENTITY_EXTRACTION',
  },
};

/**
 * 플래그 활성화 여부 확인
 *
 * 환경 변수가 "true"이면 활성화, 없으면 defaultValue 사용
 */
export function isFeatureEnabled(flag: FlagName): boolean {
  const config = FLAG_CONFIGS[flag];
  if (!config) return false;

  const envValue = process.env[config.envKey];
  if (envValue === undefined || envValue === null) {
    return config.defaultValue;
  }
  return envValue.toLowerCase() === 'true';
}

/**
 * 사용자 ID 기반 플래그 확인 (퍼센티지 롤아웃용 클라이언트 측 구현)
 * 서버 측 결정을 존중하되, 클라이언트 캐싱용으로 사용
 */
export function isFeatureEnabledForUser(flag: FlagName, userId: string): boolean {
  if (!isFeatureEnabled(flag)) return false;

  // 사용자 ID 해시 기반 일관적 버킷 할당
  const bucket = hashToBucket(userId, flag);
  const pctKey = `NEXT_PUBLIC_FF_${flag}_PCT` as keyof NodeJS.ProcessEnv;
  const percentage = parseFloat(process.env[pctKey] || '100');

  return bucket < percentage;
}

/**
 * 모든 플래그 상태 반환 (디버깅/로깅용)
 */
export function getAllFlags(): Record<FlagName, boolean> {
  return Object.fromEntries(
    (Object.keys(FLAG_CONFIGS) as FlagName[]).map((name) => [
      name,
      isFeatureEnabled(name),
    ])
  ) as Record<FlagName, boolean>;
}

// 간단한 해시 함수 (서버 측과 동일한 알고리즘 사용)
function hashToBucket(userId: string, flagName: string): number {
  const key = `${flagName}:${userId}`;
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    const char = key.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // 32bit 정수
  }
  return Math.abs(hash % 10000) / 100;
}
