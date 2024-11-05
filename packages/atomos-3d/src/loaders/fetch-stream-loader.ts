import { AbstractStreamingDataLoader } from './abstract-streaming-data-loader';

export class FetchStreamLoader extends AbstractStreamingDataLoader {
  private _paused = false;
  private _url?: string;
  private _requestConfig: RequestInit = {};
  private _controller?: AbortController | null;
  private _resumePromiseResolve?: (value: unknown) => void;
  loadFinished = false;

  constructor(config: {
    url: string;
    frameFlag: string;
    onFrame?: (frame: string) => void;
    requestConfig?: RequestInit;
  }) {
    const { url, frameFlag, requestConfig, onFrame } = config;
    super({ frameFlag, onFrame });
    this._onFrame = onFrame;
    this._url = url;
    this._frameFlag = frameFlag;
    if (requestConfig) {
      this._requestConfig = requestConfig;
    }
  }

  startStreaming = async () => {
    if (!this._url) return;

    if (this._controller) {
      this._controller.abort();
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

  private reset = () => {
    this.loadFinished = false;
    this._buffer = '';
    this._paused = false;
  };
}
