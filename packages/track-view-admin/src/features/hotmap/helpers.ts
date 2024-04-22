import { Event } from './apis';

export interface HotmapData {
  x: number;
  y: number;
  value: number;
}

export const makeHotmapData = (
  events: { id: string; attributes: Event }[]
): Promise<HotmapData[]> => {
  const iframe = document.querySelector('iframe') as HTMLIFrameElement;
  const selectorPaths = events.map((e) => e.attributes.metaData.selectorPath);

  return new Promise((reslove) => {
    const onMessage = (
      event: MessageEvent<{
        type: string;
        boxes: { left: number; top: number; width: number; height: number }[];
      }>
    ) => {
      if (event.data.type === '__IframeElementBounds__') {
        console.log('event', event.data);
        const points = event.data.boxes
          .map((box, index) => {
            if (box) {
              const { left, top, width, height } = box;
              const { offsetXPercent, offsetYPercent } =
                events[index].attributes.metaData;
              const x = left + width * offsetXPercent;
              const y = top + height * offsetYPercent;

              return { x: +x.toFixed(0), y: +y.toFixed(0), value: 1 };
            }
          })
          .filter((v) => v) as HotmapData[];
        window.removeEventListener('message', onMessage);
        reslove(points);
      }
    };
    window.addEventListener('message', onMessage);
    iframe.contentWindow!.postMessage(
      {
        type: '__IframeElementBounds__',
        selectorPaths,
      },
      '*'
    );
  });
};
