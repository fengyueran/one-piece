import { Event, MessageType } from '../src';

interface ClickEvent extends Event {
  metaData: { selectorPath: string; offsetXPercent: number; offsetYPercent: number };
}

export const makeHotmapData = (
  events: ClickEvent[],
): Promise<{ x: number; y: number; value: number }[]> => {
  const iframe = document.querySelector('iframe') as HTMLIFrameElement;
  const selectorPaths = events.map((e) => e.metaData.selectorPath);

  return new Promise((reslove) => {
    const onMessage = (
      event: MessageEvent<{
        type: string;
        boxes: { left: number; top: number; width: number; height: number }[];
      }>,
    ) => {
      if (event.data.type === MessageType.IframeElementBounds) {
        console.log('event', event.data);
        const points = event.data.boxes
          .map((box, index) => {
            if (box) {
              const { left, top, width, height } = box;
              const { offsetXPercent, offsetYPercent } = events[index].metaData;
              const x = left + width * offsetXPercent;
              const y = top + height * offsetYPercent;

              return { x: +x.toFixed(0), y: +y.toFixed(0), value: 1 };
            }
          })
          .filter((v) => v);
        window.removeEventListener('message', onMessage);
        reslove(points);
      }
    };
    window.addEventListener('message', onMessage);
    iframe.contentWindow.postMessage(
      {
        type: MessageType.IframeElementBounds,
        selectorPaths,
      },
      '*',
    );
  });
};
