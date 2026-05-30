// Type definitions for @hangi-n42/civil-utils

export interface ComplaintData {
  id?: string | null;
  complaint_id?: string;
  title?: string;
  subject?: string;
  content?: string;
  body?: string;
  text?: string;
  status?: string;
  created_at?: string;
  createdAt?: string;
  source?: string;
  region?: string;
  location?: string;
}

export interface NormalizedComplaint {
  id: string | null;
  title: string;
  content: string;
  category: string;
  status: string;
  createdAt: string;
  metadata: {
    source: string;
    region: string | null;
  };
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface MaskOptions {
  maskChar?: string;
}

export function maskPII(text: string, options?: MaskOptions): string;
export function normalizeComplaint(raw: ComplaintData): NormalizedComplaint;
export function formatDate(date: Date | string, format?: 'full' | 'date' | 'time'): string;
export function parseKoreanDate(koreanDateStr: string): Date;
export function validateComplaintSchema(complaint: object): ValidationResult;
export const version: string;
