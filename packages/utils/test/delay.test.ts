import { delay } from '../src';

test('delay function resolves after specified duration', async () => {
  const duration = 1000; // 1000毫秒，即1秒
  const start = Date.now();

  await delay(duration);

  const end = Date.now();
  const timePassed = end - start;

  // 检查实际等待时间是否在预期时间附近
  // 允许一些误差，因为setTimeout的精度可能不是完全准确的
  expect(timePassed).toBeGreaterThanOrEqual(duration);
  expect(timePassed).toBeLessThan(duration + 100); // 允许一定的误差范围
});
