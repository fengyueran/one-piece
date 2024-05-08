const delay = () =>
  new Promise((reslove, reject) => {
    setTimeout(() => {
      reslove(1);
    }, 1000);
  });

interface AtomInfo {
  id: number;
  element: string;
  x: number;
  y: number;
  z: number;
}

const parseLammpsData = (frameStr: string) => {
  const parts = frameStr.split('TEM: ATOMS id element x y z');

  const lines = parts[1].split('\n').slice(1, -1);
  const atoms = lines.map((line) => {
    const lineParts = line.split(' ');
    return {
      id: parseInt(lineParts[0]),
      element: lineParts[1],
      x: parseFloat(lineParts[2]),
      y: parseFloat(lineParts[3]),
      z: parseFloat(lineParts[4]),
    };
  });

  console.log('atoms', atoms.length);

  return atoms;
};

export class LammpsTrjLoader {
  private _paused = false;
  private _url?: string;
  private _buffer = ''; //缓冲区
  private _resumePromiseResolve?: (value: unknown) => void;
  private _onModel: (atomInfos: AtomInfo[]) => void;

  constructor(config: {
    url: string;
    onModel: (atomInfos: AtomInfo[]) => void;
  }) {
    const { url, onModel } = config;
    this._onModel = onModel;
    this._url = url;
  }

  fetchAndStream = async () => {
    if (!this._url) return;

    const response = await fetch(this._url);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    // 获取 ReadableStream
    const reader = response.body?.getReader();

    if (!reader) {
      throw new Error('reader was not ok');
    }

    // eslint-disable-next-line
    while (true) {
      if (this._paused) {
        await new Promise((resolve) => (this._resumePromiseResolve = resolve));
      }
      const { done, value } = await reader.read();

      this._buffer += new TextDecoder().decode(value, { stream: true });
      this.processBuffer();
      if (done) {
        console.log('Stream completed');
        break;
      }
    }
  };

  processBuffer = () => {
    this.pause();
    let start = this._buffer.indexOf('ITEM: TIMESTEP');

    while (start !== -1) {
      const end = this._buffer.indexOf('ITEM: TIMESTEP', start + 1);
      if (end === -1) break;

      // 处理完整的帧
      const frameStr = this._buffer.substring(start, end);
      const frameAtoms = parseLammpsData(frameStr);
      this._onModel(frameAtoms);

      // 更新缓冲区
      this._buffer = this._buffer.substring(end);
      start = this._buffer.indexOf('ITEM: TIMESTEP');
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
}
