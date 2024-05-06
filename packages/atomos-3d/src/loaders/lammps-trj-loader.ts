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

export class LammpsTrjLoader {
  private _paused = false;
  private _preStr = '';
  private _models: AtomInfo[][] = [];
  private _streamController?: ReadableStreamDefaultController;
  private _resumePromiseResolve?: (value: unknown) => void;
  private _onModel: (atomInfos: AtomInfo[]) => void;

  constructor(config: { onModel: (atomInfos: AtomInfo[]) => void }) {
    const { onModel } = config;
    this._onModel = onModel;
  }

  parseLammpsData = (data: string, preStr = '') => {
    const frames = `${preStr}\n${data}`.split('ITEM: TIMESTEP');
    this._preStr = '';
    const validFrames = [];

    frames.slice(1).forEach((frame, index) => {
      const parts = frame.split('TEM: ATOMS id element x y z');
      // if (!parts[1]) {
      //   debugger; //eslint-disable-line
      //   return [];
      // }
      const lines = parts[1].split('\n').slice(1, -1);

      if (lines.length < 5666) {
        this._preStr = frame;
      } else {
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

        console.log('values', values.length);

        validFrames.push(values);
      }
    });
    return validFrames;
  };

  fetchAndStream = async (url) => {
    const response = await fetch(url);
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let receivedLength = 0;
    const that = this;

    const handleChunk = (value: Uint8Array) => {
      this.pause();
      const textChunk = decoder.decode(value, { stream: true });
      const frameDatas = this.parseLammpsData(textChunk);

      frameDatas.forEach((frameData) => {
        this._onModel(frameData);
      });
    };

    // 创建一个新的 ReadableStream 来处理数据流
    const stream = new ReadableStream({
      start(controller) {
        console.log('Stream started');
      },
      async pull(controller) {
        while (true) {
          if (that._paused) {
            // 等待恢复信号
            await new Promise(
              (resolve) => (that._resumePromiseResolve = resolve)
            );
          }

          const { done, value } = await reader.read();
          handleChunk(value);
          if (done) {
            controller.close();
            console.log('Stream completed');
            break; // 退出循环，防止无限循环
          }
          // console.log('receivedLength', receivedLength);

          receivedLength += value.length; // 更新接收到的数据长度
          controller.enqueue(value); // 将数据块放入流中
          // await delay();
        }
      },
      cancel() {
        console.log('Stream cancelled');
      },
    });

    // 使用这个流的示例（根据具体情况）
    const newResponse = new Response(stream);
  };
  // fetchAndStream = async (url: string) => {
  //   const response = await fetch(url);
  //   const reader = response.body.getReader();
  //   // const decoder = new TextDecoder('utf-8');

  //   let receivedLength = 0;
  //   // const that = this;

  //   // const handleChunk = (value: Uint8Array) => {
  //   //   this.pause();
  //   //   const textChunk = decoder.decode(value, { stream: true });
  //   //   const frameDatas = parseLammpsData(textChunk);

  //   //   frameDatas.forEach((frameData) => {
  //   //     this._onModel(frameData);
  //   //   });
  //   // };

  //   // 创建一个新的 ReadableStream 来处理暂停和恢复
  //   const stream = new ReadableStream({
  //     start(controller) {
  //       // that._streamController = controller;
  //     },
  //     async pull(controller) {
  //       while (true) {
  //         // if (that._paused) {
  //         //   // 等待恢复信号
  //         //   await new Promise(
  //         //     (resolve) => (that._resumePromiseResolve = resolve)
  //         //   );
  //         // }

  //         const { done, value } = await reader.read();
  //         if (done) {
  //           controller.close();
  //           console.log('Stream completed');
  //           return;
  //         }
  //         console.log('receivedLength', receivedLength);
  //         // handleChunk(value);
  //         // receivedLength += value.length;

  //         controller.enqueue(value);
  //         // await delay();
  //       }
  //     },
  //     cancel() {
  //       console.log('Stream cancelled');
  //     },
  //   });

  //   return new Response(stream).text();
  // };

  read = () => {
    this._paused = false;
  };

  // fetchAndStream = async (url) => {
  //   const handleChunk = (value: Uint8Array) => {
  //     // this.pause();
  //     const textDecoder = new TextDecoder();
  //     const textChunk = textDecoder.decode(value, { stream: true });
  //     const frameDatas = parseLammpsData(textChunk);
  //     // this._models = [...this._models, ...frameDatas];
  //     frameDatas.forEach((frameData) => {
  //       this._onModel(frameData);
  //     });
  //   };

  //   const response = await fetch(url);

  //   // 确认响应有效
  //   if (!response.ok) {
  //     throw new Error('Network response was not ok');
  //   }

  //   // 获取 ReadableStream
  //   const reader = response.body.getReader();
  //   let receivedLength = 0; // 接收到的数据量

  //   // 逐步读取数据
  //   while (true) {
  //     await delay();
  //     const { done, value } = await reader.read();

  //     if (done) {
  //       console.log('数据接收完毕');
  //       break;
  //     }

  //     receivedLength += value.length;
  //     console.log('value.length', value.length);
  //     handleChunk(value);
  //   }
  // };

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
