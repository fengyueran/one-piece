import { FetcherMgr, Locator, AnyOption, Data, PayLoadType, FetchType } from '.';

const dummyFn = async (_locator: Locator, _option: AnyOption) =>
  new Data(PayLoadType.NO_CONTENT, undefined);

describe('test url', () => {
  test('url mgr', async () => {
    const defaultFetcher = new FetcherMgr();
    defaultFetcher.register(FetchType.Url, dummyFn);
  });
  test('register again', () => {
    expect(() => {
      const defaultFetcher = new FetcherMgr();
      defaultFetcher.register(FetchType.Url, dummyFn);
      defaultFetcher.register(FetchType.Url, dummyFn);
    }).toThrow('FetcherMgr, url is existed, registered failed');
  });
  test('unregistered type', async () => {
    const defaultFetcher = new FetcherMgr();
    await expect(
      defaultFetcher.fetch(
        FetchType.Url,
        {
          url: 'http://192.168.201.46:2222/app/explorer.html',
        },
        {},
      ),
    ).rejects.toThrow('FetcherMgr: url is not registered.');
  });
});
