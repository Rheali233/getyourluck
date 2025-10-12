/**
 * 工具函数测试
 */

import {
  cn,
  generateUUID,
  formatDate,
  delay,
  safeJsonParse,
  hashString,
  isValidUUID,
  sanitizeString
} from '../utils/index';

describe('Utility Functions', () => {
  describe('cn (className merge)', () => {
    it('should merge class names correctly', () => {
      const result = cn('class1', 'class2', 'class3');
      expect(result).toBe('class1 class2 class3');
    });

    it('should handle conditional classes', () => {
      const isActive = true;
      const result = cn('base', isActive && 'active', 'always');
      expect(result).toBe('base active always');
    });

    it('should handle falsy values', () => {
      const isActive = false;
      const result = cn('base', isActive && 'active', 'always');
      expect(result).toBe('base always');
    });

    it('should handle arrays', () => {
      const result = cn(['class1', 'class2'], 'class3');
      expect(result).toBe('class1 class2 class3');
    });
  });

  describe('generateUUID', () => {
    it('should generate unique UUIDs', () => {
      const uuid1 = generateUUID();
      const uuid2 = generateUUID();
      
      expect(uuid1).not.toBe(uuid2);
      expect(uuid1).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
      expect(uuid2).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should generate valid UUID format', () => {
      const uuid = generateUUID();
      expect(isValidUUID(uuid)).toBe(true);
    });
  });

  describe('formatDate', () => {
    it('should format Date object', () => {
      const date = new Date('2024-01-01T00:00:00.000Z');
      const result = formatDate(date);
      expect(result).toBe('2024-01-01T00:00:00.000Z');
    });

    it('should format date string', () => {
      const dateString = '2024-01-01T00:00:00.000Z';
      const result = formatDate(dateString);
      expect(result).toBe('2024-01-01T00:00:00.000Z');
    });

    it('should handle invalid date string', () => {
      const invalidDate = 'invalid-date';
      const result = formatDate(invalidDate);
      expect(result).toBe('Invalid Date');
    });
  });

  describe('delay', () => {
    it('should delay execution', async () => {
      const start = Date.now();
      await delay(100);
      const end = Date.now();
      
      expect(end - start).toBeGreaterThanOrEqual(100);
    });

    it('should return a promise', () => {
      const result = delay(100);
      expect(result).toBeInstanceOf(Promise);
    });
  });

  describe('safeJsonParse', () => {
    it('should parse valid JSON', () => {
      const validJson = '{"key": "value"}';
      const result = safeJsonParse(validJson, {});
      
      expect(result).toEqual({ key: 'value' });
    });

    it('should return fallback for invalid JSON', () => {
      const invalidJson = 'invalid json';
      const fallback = { default: 'value' };
      const result = safeJsonParse(invalidJson, fallback);
      
      expect(result).toBe(fallback);
    });

    it('should return fallback for empty string', () => {
      const fallback = { default: 'value' };
      const result = safeJsonParse('', fallback);
      
      expect(result).toBe(fallback);
    });
  });

  describe('hashString', () => {
    it('should generate hash for string', async () => {
      const input = 'test string';
      const result = await hashString(input);
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.length).toBe(64); // SHA-256 hash length
    });

    it('should generate consistent hash for same input', async () => {
      const input = 'test string';
      const hash1 = await hashString(input);
      const hash2 = await hashString(input);
      
      expect(hash1).toBe(hash2);
    });

    it('should generate different hashes for different inputs', async () => {
      const hash1 = await hashString('input1');
      const hash2 = await hashString('input2');
      
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('isValidUUID', () => {
    it('should validate correct UUIDs', () => {
      const validUUIDs = [
        '123e4567-e89b-12d3-a456-426614174000',
        '987fcdeb-51a2-4321-b987-654321098fed',
        '00000000-0000-0000-0000-000000000000'
      ];
      
      validUUIDs.forEach(uuid => {
        expect(isValidUUID(uuid)).toBe(true);
      });
    });

    it('should reject invalid UUIDs', () => {
      const invalidUUIDs = [
        'not-a-uuid',
        '123e4567-e89b-12d3-a456-42661417400', // too short
        '123e4567-e89b-12d3-a456-4266141740000', // too long
        '123e4567-e89b-12d3-a456-42661417400g', // invalid character
        '123e4567-e89b-12d3-a456-42661417400', // missing character
        ''
      ];
      
      invalidUUIDs.forEach(uuid => {
        expect(isValidUUID(uuid)).toBe(false);
      });
    });

    it('should handle edge cases', () => {
      expect(isValidUUID('')).toBe(false);
      expect(isValidUUID(null as any)).toBe(false);
      expect(isValidUUID(undefined as any)).toBe(false);
    });
  });

  describe('sanitizeString', () => {
    it('should trim whitespace', () => {
      const result = sanitizeString('  test string  ');
      expect(result).toBe('test string');
    });

    it('should limit string length', () => {
      const longString = 'a'.repeat(100);
      const result = sanitizeString(longString, 50);
      expect(result.length).toBe(50);
      expect(result).toBe('a'.repeat(50));
    });

    it('should use default max length', () => {
      const longString = 'a'.repeat(2000);
      const result = sanitizeString(longString);
      expect(result.length).toBe(1000);
    });

    it('should handle empty string', () => {
      const result = sanitizeString('');
      expect(result).toBe('');
    });

    it('should handle string shorter than max length', () => {
      const shortString = 'short';
      const result = sanitizeString(shortString, 100);
      expect(result).toBe('short');
    });

    it('should handle special characters', () => {
      const specialString = 'test\n\r\tstring';
      const result = sanitizeString(specialString);
      expect(result).toBe('test\n\r\tstring');
    });
  });
});
