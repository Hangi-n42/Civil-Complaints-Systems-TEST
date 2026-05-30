'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { maskPII, normalizeComplaint, formatDate, parseKoreanDate, validateComplaintSchema } = require('../index');

describe('maskPII', () => {
  it('전화번호를 마스킹한다', () => {
    const result = maskPII('연락처: 010-1234-5678');
    assert.match(result, /010-\*{4}-5678/);
  });

  it('이메일을 마스킹한다', () => {
    const result = maskPII('이메일: user@example.com');
    assert.ok(!result.includes('user@'));
    assert.ok(result.includes('@example.com'));
  });

  it('문자열이 아닌 값은 그대로 반환한다', () => {
    assert.equal(maskPII(null), null);
    assert.equal(maskPII(123), 123);
  });
});

describe('normalizeComplaint', () => {
  it('원본 데이터를 표준 구조로 변환한다', () => {
    const raw = { id: '1', title: '도로 파손 민원', content: '도로에 구멍이 났습니다.' };
    const result = normalizeComplaint(raw);
    assert.equal(result.id, '1');
    assert.equal(result.category, 'ROAD');
    assert.equal(result.status, 'RECEIVED');
  });

  it('유효하지 않은 입력에서 에러를 던진다', () => {
    assert.throws(() => normalizeComplaint(null), /유효하지 않은/);
  });
});

describe('formatDate', () => {
  it('날짜를 KST 형식으로 포맷한다', () => {
    const result = formatDate('2025-01-01T00:00:00Z', 'date');
    assert.equal(result, '2025-01-01');
  });

  it('잘못된 날짜에서 에러를 던진다', () => {
    assert.throws(() => formatDate('invalid-date'), /유효하지 않은/);
  });
});

describe('parseKoreanDate', () => {
  it('한국어 날짜를 파싱한다', () => {
    const result = parseKoreanDate('2025년 3월 15일');
    assert.equal(result.getUTCFullYear(), 2025);
    assert.equal(result.getUTCMonth(), 2); // 0-indexed
    assert.equal(result.getUTCDate(), 15);
  });

  it('잘못된 형식에서 에러를 던진다', () => {
    assert.throws(() => parseKoreanDate('2025-03-15'), /파싱 실패/);
  });
});

describe('validateComplaintSchema', () => {
  it('유효한 민원을 통과시킨다', () => {
    const { valid, errors } = validateComplaintSchema({ title: '제목', content: '내용' });
    assert.equal(valid, true);
    assert.equal(errors.length, 0);
  });

  it('필수 필드 누락 시 에러를 반환한다', () => {
    const { valid, errors } = validateComplaintSchema({ title: '제목' });
    assert.equal(valid, false);
    assert.ok(errors.some(e => e.includes('content')));
  });
});
