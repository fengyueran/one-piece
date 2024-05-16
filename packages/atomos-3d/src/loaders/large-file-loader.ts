export class LargeFileLoader {
  private _paused = false;
  private _url?: string;
  private _frameFlag: string;
  private _requestConfig: RequestInit = {};
  private _buffer = ''; //缓冲区
  private _controller?: AbortController | null;
  private _resumePromiseResolve?: (value: unknown) => void;
  private _onModel: (frame: string) => void;
  loadFinished = false;

  constructor(config: {
    url: string;
    frameFlag: string;
    requestConfig?: RequestInit;
    onModel: (frame: string) => void;
  }) {
    const { url, frameFlag, requestConfig, onModel } = config;
    this._onModel = onModel;
    this._url = url;
    this._frameFlag = frameFlag;
    if (requestConfig) {
      this._requestConfig = requestConfig;
    }
  }

  fetchAndStream = async () => {
    if (!this._url) return;

    if (this._controller) {
      this._controller.abort(); // 取消当前的fetch操作
    }

    this.reset();

    const currentController = new AbortController();
    this._controller = currentController;

    const { signal } = this._controller;

    try {
      const response = await fetch(this._url, {
        signal,
        ...this._requestConfig,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body?.getReader();

      if (!reader) {
        throw new Error('Reader was not ok');
      }

      // eslint-disable-next-line
      while (true) {
        if (this._paused) {
          await new Promise(
            (resolve) => (this._resumePromiseResolve = resolve)
          );
        }
        if (signal.aborted) {
          console.log('Stream aborted');
          break;
        }
        const { done, value } = await reader.read();

        this._buffer += new TextDecoder().decode(value, { stream: true });
        this.processBuffer();
        if (done) {
          console.log('Stream completed');
          this.loadFinished = true;
          this._controller = null;
          break;
        }
      }
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        console.log('Fetch aborted');
      } else {
        console.log('');
        throw error;
      }
    } finally {
      if (currentController === this._controller) {
        this._controller = null;
      }
    }
  };

  processBuffer = () => {
    this.pause();
    let start = this._buffer.indexOf(this._frameFlag);

    while (start !== -1) {
      const end = this._buffer.indexOf(this._frameFlag, start + 1);
      if (end === -1) break;

      // 处理完整的帧
      const frameStr = this._buffer.substring(start, end);
      this._onModel(frameStr);

      // 更新缓冲区
      this._buffer = this._buffer.substring(end);
      start = this._buffer.indexOf(this._frameFlag);
    }
  };

  pause = () => {
    this._paused = true;
  };

  resume = () => {
    if (this._paused) {
      this._paused = false;
      if (this._resumePromiseResolve) {
        this._resumePromiseResolve(1);
      }
    }
  };

  reset = () => {
    this.loadFinished = false;
    this._buffer = '';
    this._paused = false;
  };
}
