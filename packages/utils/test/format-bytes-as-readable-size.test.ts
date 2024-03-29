import { formatBytesAsReadableSize } from '../src';

test('should format 10 bytes as "10 B"', () => {
  expect(formatBytesAsReadableSize(10)).toBe('102 B');
});

test('should format 1028 bytes as "1 KB"', () => {
  expect(formatBytesAsReadableSize(1028)).toBe('1 KB');
});

test('should format 1,048,586 bytes (1 MB + 10 bytes) as "1 MB"', () => {
  expect(formatBytesAsReadableSize(1024 * 1024 + 10)).toBe('1 MB');
});

test('should format 1,073,741,834 bytes (1 GB + 10 bytes) as "1 GB"', () => {
  expect(formatBytesAsReadableSize(1024 * 1024 * 1024 + 10)).toBe('1 GB');
});

test('should format 32,212,254,720 bytes (30 GB) as "30 GB"', () => {
  expect(formatBytesAsReadableSize(1024 * 1024 * 1024 * 30)).toBe('30 GB');
});
