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
  private _buffer = ''; //缓冲区
  private _resumePromiseResolve?: (value: unknown) => void;
  private _onModel: (atomInfos: AtomInfo[]) => void;

  constructor(config: { onModel: (atomInfos: AtomInfo[]) => void }) {
    const { onModel } = config;
    this._onModel = onModel;
  }

  // fetchAndStream = async (url) => {
  //   const response = await fetch(url);
  //   const reader = response.body.getReader();
  //   const decoder = new TextDecoder('utf-8');
  //   let receivedLength = 0;
  //   const that = this;

  //   const handleChunk = (value: Uint8Array) => {
  //     this.pause();
  //     const textChunk = decoder.decode(value, { stream: true });
  //     const frameDatas = this.parseLammpsData(textChunk);

  //     frameDatas.forEach((frameData) => {
  //       this._onModel(frameData);
  //     });
  //   };

  //   // 创建一个新的 ReadableStream 来处理数据流
  //   const stream = new ReadableStream({
  //     start(controller) {
  //       console.log('Stream started');
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
  //         handleChunk(value);
  //         if (done) {
  //           controller.close();
  //           console.log('Stream completed');
  //           break; // 退出循环，防止无限循环
  //         }
  //         // console.log('receivedLength', receivedLength);

  //         receivedLength += value.length; // 更新接收到的数据长度
  //         controller.enqueue(value); // 将数据块放入流中
  //         // await delay();
  //       }
  //     },
  //     cancel() {
  //       console.log('Stream cancelled');
  //     },
  //   });

  //   // 使用这个流的示例（根据具体情况）
  //   const newResponse = new Response(stream);
  // };

  fetchAndStream = async (url: string) => {
    const response = await fetch(url);

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
