import { readFile } from '../src';

// 模拟 FileReader
// eslint-disable-next-line
//@ts-ignore
global.FileReader = jest.fn().mockImplementation(() => ({
  readAsText: jest.fn().mockImplementation(function (file: File) {
    if (file) {
      this.onload({
        target: {
          result: 'file content', // 模拟读取到的文件内容
        },
      });
    } else {
      this.onerror({
        target: {
          error: new Error('Error reading file'),
        },
      });
    }
  }),
  onerror: jest.fn(),
}));

describe('readFileAsString', () => {
  it('should read a file and return its content as a string', async () => {
    const mockFile = new Blob(['file content'], { type: 'text/plain' });
    const content = await readFile(mockFile as File);
    expect(content).toBe('file content');
  });

  it('should reject if reading fails', async () => {
    // eslint-disable-next-line
    await expect(readFile('' as any)).rejects.toThrow('Error reading file');
  });
});
