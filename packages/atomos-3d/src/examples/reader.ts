const delay = () =>
  new Promise((reslove, reject) => {
    setTimeout(() => {
      reslove(1);
    }, 20000);
  });

type AtomData = {
  id: number;
  element: string;
  x: number;
  y: number;
  z: number;
};

const parseLammpsData = (data: string) => {
  const frames = data.split('ITEM: TIMESTEP');

  return frames.slice(1).map((frame) => {
    const parts = frame.split('TEM: ATOMS id element x y z');
    const lines = parts[1].split('\n').slice(1, -1);

    const values = lines.map((line) => {
      const lineParts = line.split(' ');
      return {
        id: parseInt(lineParts[0]),
        element: lineParts[1],
        x: parseFloat(lineParts[2]) + Math.random(),
        y: parseFloat(lineParts[3]) + Math.random(),
        z: parseFloat(lineParts[4]) + Math.random(),
      };
    });

    return values;
  });
};

export class Reader {
  private _paused = false;
  private _streamController?: ReadableStreamDefaultController;
  private _resumePromiseResolve?: (value: unknown) => void;

  constructor(private onData: (data: AtomData[][]) => void) {}

  fetchAndStream = async (url: string) => {
    const response = await fetch(url);
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');

    let receivedLength = 0;
    const that = this;

    const handleChunk = (value: Uint8Array) => {
      const textChunk = decoder.decode(value, { stream: true });
      const frames = parseLammpsData(textChunk);
      this.onData(frames);
    };

    // 创建一个新的 ReadableStream 来处理暂停和恢复
    const stream = new ReadableStream({
      start(controller) {
        that._streamController = controller;
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
          if (done) {
            controller.close();
            console.log('Stream completed');
            return;
          }
          handleChunk(value);
          receivedLength += value.length;

          console.log('receivedLength', receivedLength);
          controller.enqueue(value);
          await delay();
        }
      },
      cancel() {
        console.log('Stream cancelled');
      },
    });

    return new Response(stream).text();
  };

  addTrajectory = (url: string) => {
    this.fetchAndStream(url);
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
