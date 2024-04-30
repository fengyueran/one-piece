const delay = () =>
  new Promise((reslove, reject) => {
    setTimeout(() => {
      reslove(1);
    }, 10);
  });

interface AtomInfo {
  id: number;
  element: string;
  x: number;
  y: number;
  z: number;
}

const parseLammpsData = (data: string) => {
  const frames = data.split('ITEM: TIMESTEP');

  return frames.slice(1).map((frame, index) => {
    const parts = frame.split('TEM: ATOMS id element x y z');
    if (!parts[1]) {
      return [];
    }
    const lines = parts[1].split('\n').slice(1, -1);

    if (lines.length !== 5666 && index !== frames.length - 2) {
      debugger; //eslint-disable-line
    }

    const values = lines.map((line) => {
      const lineParts = line.split(' ');
      return {
        id: parseInt(lineParts[0]),
        element: lineParts[1],
        x: parseFloat(lineParts[2]),
        y: parseFloat(lineParts[3]),
        z: parseFloat(lineParts[4]),
      };
    });

    return values;
  });
};

export class LammpsTrjLoader {
  private _paused = false;
  private _models: AtomInfo[][] = [];
  private _streamController?: ReadableStreamDefaultController;
  private _resumePromiseResolve?: (value: unknown) => void;
  private _onModel: (atomInfos: AtomInfo[]) => void;

  constructor(config: { onModel: (atomInfos: AtomInfo[]) => void }) {
    const { onModel } = config;
    this._onModel = onModel;
  }

  // fetchAndStream = async (url: string) => {
  //   const response = await fetch(url);
  //   const reader = response.body.getReader();
  //   const decoder = new TextDecoder('utf-8');

  //   let receivedLength = 0;
  //   const that = this;

  //   const handleChunk = (value: Uint8Array) => {
  //     this.pause();
  //     const textChunk = decoder.decode(value, { stream: true });
  //     const frameDatas = parseLammpsData(textChunk);

  //     frameDatas.forEach((frameData) => {
  //       this._onModel(frameData);
  //     });
  //   };

  //   // 创建一个新的 ReadableStream 来处理暂停和恢复
  //   const stream = new ReadableStream({
  //     start(controller) {
  //       that._streamController = controller;
  //     },
  //     async pull(controller) {
  //       while (true) {
  //         if (that._paused) {
  //           // 等待恢复信号
  //           await new Promise(
  //             (resolve) => (that._resumePromiseResolve = resolve)
  //           );
  //         }

  //         const { done, value } = await reader.read();
  //         if (done) {
  //           controller.close();
  //           console.log('Stream completed');
  //           return;
  //         }
  //         console.log('receivedLength', receivedLength);
  //         // handleChunk(value);
  //         receivedLength += value.length;

  //         controller.enqueue(value);
  //         await delay();
  //       }
  //     },
  //     cancel() {
  //       console.log('Stream cancelled');
  //     },
  //   });

  //   return new Response(stream).text();
  // };

  fetchAndStream = async (url) => {
    const handleChunk = (value: Uint8Array) => {
      // this.pause();
      const textDecoder = new TextDecoder();
      const textChunk = textDecoder.decode(value, { stream: true });
      const frameDatas = parseLammpsData(textChunk);
      // this._models = [...this._models, ...frameDatas];
      frameDatas.forEach((frameData) => {
        this._onModel(frameData);
      });
    };

    const response = await fetch(url);

    // 确认响应有效
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    // 获取 ReadableStream
    const reader = response.body.getReader();
    let receivedLength = 0; // 接收到的数据量

    // 逐步读取数据
    while (true) {
      await delay();
      const { done, value } = await reader.read();

      if (done) {
        console.log('数据接收完毕');
        break;
      }

      receivedLength += value.length;
      console.log('value.length', value.length);
      handleChunk(value);
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
