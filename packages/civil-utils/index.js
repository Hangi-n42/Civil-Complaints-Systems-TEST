'use strict';

/**
 * @hangi-n42/civil-utils
 * 민원 시스템 공통 유틸리티 패키지
 */

const { maskPII } = require('./lib/pii');
const { normalizeComplaint } = require('./lib/complaint');
const { formatDate, parseKoreanDate } = require('./lib/date');
const { validateComplaintSchema } = require('./lib/validate');

module.exports = {
  maskPII,
  normalizeComplaint,
  formatDate,
  parseKoreanDate,
  validateComplaintSchema,
  version: require('./package.json').version,
};
