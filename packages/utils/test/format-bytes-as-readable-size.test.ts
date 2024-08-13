import { formatBytesAsReadableSize } from '../src';

test('should format 10 bytes as "10 B"', () => {
  expect(formatBytesAsReadableSize(10)).toBe('10 B');
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

it('formats bytes correctly with specified decimals', () => {
  expect(formatBytesAsReadableSize(1024, 2)).toBe('1.00 KB');
  expect(formatBytesAsReadableSize(1536, 2)).toBe('1.50 KB');
  expect(formatBytesAsReadableSize(1048576, 3)).toBe('1.000 MB');
  expect(formatBytesAsReadableSize(1073741824, 4)).toBe('1.0000 GB');
  expect(formatBytesAsReadableSize(123456789, 3)).toBe('117.738 MB');
});

it('should correctly format when a numeric string is passed as input', () => {
  //@ts-ignore
  expect(formatBytesAsReadableSize('0')).toBe('0 B');
  //@ts-ignore
  expect(formatBytesAsReadableSize('1024')).toBe('1 KB');
});

it('should throw an error for negative byte values', () => {
  expect(() => formatBytesAsReadableSize(-1)).toThrow('Byte size cannot be negative');
});

it('should throw an error for non-numeric inputs', () => {
  //@ts-ignore
  expect(() => formatBytesAsReadableSize('a')).toThrow(
    'Invalid input: byte size must be a numeric value',
  );
});
