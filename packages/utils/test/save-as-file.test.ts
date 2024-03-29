import { saveAsFile } from '../src';

describe('saveAsFile', () => {
  // 模拟创建的<a>元素和URL相关方法
  beforeEach(() => {
    // 模拟 createElement 方法
    document.createElement = jest.fn().mockReturnValue({
      href: '',
      download: '',
      style: {},
      click: jest.fn(),
      addEventListener: jest.fn((_, evtHandler) => {
        evtHandler();
      }),
    });

    // 模拟 URL.createObjectURL 和 URL.revokeObjectURL
    window.URL.createObjectURL = jest.fn();
    window.URL.revokeObjectURL = jest.fn();

    // 模拟 appendChild 和 removeChild
    document.body.appendChild = jest.fn();
    document.body.removeChild = jest.fn();
  });

  it('should create a blob from the given content and trigger a download', () => {
    const testFileName = 'test.txt';
    const testContent = 'Hello, world!';

    saveAsFile(testFileName, testContent);

    // 验证 createElement 是否被调用以创建<a>元素
    expect(document.createElement).toHaveBeenCalledWith('a');

    // 验证是否为<a>元素设置了正确的属性
    // eslint-disable-next-line
    //@ts-ignore
    const createdElement = document.createElement.mock.results[0].value;
    expect(createdElement.download).toBe(testFileName);

    // 验证是否触发了 click 事件来下载文件
    expect(createdElement.click).toHaveBeenCalled();

    // // 验证是否正确地创建了 Blob 对象并获取了对象URL
    expect(window.URL.createObjectURL).toHaveBeenCalled();
  });
});
