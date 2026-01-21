import { describe, it, expect } from 'vitest';
import { formatDate, formatDateSafe } from '../dateFormatter';

describe('dateFormatter', () => {
  describe('formatDate', () => {
    it('should format a simple date correctly', () => {
      expect(formatDate('1/1/2001')).toBe('Jan 1, 2001');
    });

    it('should format a date with double-digit month and day', () => {
      expect(formatDate('12/25/2023')).toBe('Dec 25, 2023');
    });

    it('should handle all months correctly', () => {
      expect(formatDate('1/15/2020')).toBe('Jan 15, 2020');
      expect(formatDate('2/15/2020')).toBe('Feb 15, 2020');
      expect(formatDate('3/15/2020')).toBe('Mar 15, 2020');
      expect(formatDate('4/15/2020')).toBe('Apr 15, 2020');
      expect(formatDate('5/15/2020')).toBe('May 15, 2020');
      expect(formatDate('6/15/2020')).toBe('Jun 15, 2020');
      expect(formatDate('7/15/2020')).toBe('Jul 15, 2020');
      expect(formatDate('8/15/2020')).toBe('Aug 15, 2020');
      expect(formatDate('9/15/2020')).toBe('Sep 15, 2020');
      expect(formatDate('10/15/2020')).toBe('Oct 15, 2020');
      expect(formatDate('11/15/2020')).toBe('Nov 15, 2020');
      expect(formatDate('12/15/2020')).toBe('Dec 15, 2020');
    });

    it('should handle dates with leading zeros', () => {
      expect(formatDate('01/01/2001')).toBe('Jan 1, 2001');
      expect(formatDate('03/05/2022')).toBe('Mar 5, 2022');
    });

    it('should handle dates with extra whitespace', () => {
      expect(formatDate(' 1/1/2001 ')).toBe('Jan 1, 2001');
      expect(formatDate('  12/25/2023  ')).toBe('Dec 25, 2023');
    });

    it('should throw error for empty string', () => {
      expect(() => formatDate('')).toThrow('Invalid date string: must be a non-empty string');
    });

    it('should throw error for non-string input', () => {
      expect(() => formatDate(null as any)).toThrow('Invalid date string: must be a non-empty string');
      expect(() => formatDate(undefined as any)).toThrow('Invalid date string: must be a non-empty string');
    });

    it('should throw error for invalid format', () => {
      expect(() => formatDate('2001-01-01')).toThrow('Invalid date format: expected "M/D/YYYY"');
      expect(() => formatDate('1/1')).toThrow('Invalid date format: expected "M/D/YYYY"');
      expect(() => formatDate('1/1/2001/extra')).toThrow('Invalid date format: expected "M/D/YYYY"');
    });

    it('should throw error for invalid month', () => {
      expect(() => formatDate('0/1/2001')).toThrow('Invalid month: 0. Must be between 1 and 12');
      expect(() => formatDate('13/1/2001')).toThrow('Invalid month: 13. Must be between 1 and 12');
      expect(() => formatDate('abc/1/2001')).toThrow('Invalid month: abc. Must be between 1 and 12');
    });

    it('should throw error for invalid day', () => {
      expect(() => formatDate('1/0/2001')).toThrow('Invalid day: 0. Must be between 1 and 31');
      expect(() => formatDate('1/32/2001')).toThrow('Invalid day: 32. Must be between 1 and 31');
      expect(() => formatDate('1/abc/2001')).toThrow('Invalid day: abc. Must be between 1 and 31');
    });

    it('should throw error for invalid year', () => {
      expect(() => formatDate('1/1/abc')).toThrow('Invalid year: abc. Must be a 4-digit year');
      expect(() => formatDate('1/1/01')).toThrow('Invalid year: 01. Must be a 4-digit year');
      expect(() => formatDate('1/1/20001')).toThrow('Invalid year: 20001. Must be a 4-digit year');
    });

    it('should throw error for invalid calendar dates', () => {
      expect(() => formatDate('2/30/2001')).toThrow('Invalid date: 2/30/2001 does not represent a valid calendar date');
      expect(() => formatDate('4/31/2001')).toThrow('Invalid date: 4/31/2001 does not represent a valid calendar date');
      expect(() => formatDate('2/29/2001')).toThrow('Invalid date: 2/29/2001 does not represent a valid calendar date'); // Not a leap year
    });

    it('should handle leap year dates correctly', () => {
      expect(formatDate('2/29/2020')).toBe('Feb 29, 2020'); // 2020 is a leap year
    });
  });

  describe('formatDateSafe', () => {
    it('should format valid dates correctly', () => {
      expect(formatDateSafe('1/1/2001')).toBe('Jan 1, 2001');
      expect(formatDateSafe('12/25/2023')).toBe('Dec 25, 2023');
    });

    it('should return null for invalid dates', () => {
      expect(formatDateSafe('')).toBeNull();
      expect(formatDateSafe('invalid')).toBeNull();
      expect(formatDateSafe('13/1/2001')).toBeNull();
      expect(formatDateSafe('2/30/2001')).toBeNull();
    });

    it('should return null for non-string input', () => {
      expect(formatDateSafe(null as any)).toBeNull();
      expect(formatDateSafe(undefined as any)).toBeNull();
    });
  });
});
