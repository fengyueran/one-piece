export abstract class AbstractStreamingDataLoader {
  protected _buffer = '';
  protected _frameFlag: string;
  protected _onFrame?: (frame: string) => void;

  constructor(config: {
    frameFlag: string;
    onFrame?: (frame: string) => void;
  }) {
    const { frameFlag, onFrame } = config;
    this._onFrame = onFrame;
    this._frameFlag = frameFlag;
  }

  setOnFrame = (onFrame: (frame: string) => void) => {
    this._onFrame = onFrame;
  };

  protected processBuffer = () => {
    this.pause();
    let start = this._buffer.indexOf(this._frameFlag);

    while (start !== -1) {
      const end = this._buffer.indexOf(this._frameFlag, start + 1);
      if (end === -1) break;

      // 处理完整的帧
      const frameStr = this._buffer.substring(start, end);
      this._onFrame?.(frameStr);

      // 更新缓冲区
      this._buffer = this._buffer.substring(end);
      start = this._buffer.indexOf(this._frameFlag);
    }
  };

  abstract startStreaming(): Promise<void>;

  abstract pause(): void;

  abstract resume(): void;
}
