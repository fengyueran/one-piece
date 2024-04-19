import { Event } from './apis';

export const makeHotmapData = (events: { id: string; attributes: Event }[]) => {
  return events
    .map((e) => {
      const { selectorPath, offsetXPercent, offsetYPercent } =
        e.attributes.metaData;
      const iframe = document.getElementById(
        '__hotmap_base__'
      ) as HTMLIFrameElement;
      const targetElement = iframe.contentDocument!.querySelector(selectorPath);

      if (targetElement) {
        const box = targetElement.getBoundingClientRect();
        const { left, top, width, height } = box;
        const x = left + width * offsetXPercent;
        const y = top + height * offsetYPercent;

        return { x: +x.toFixed(0), y: +y.toFixed(0), value: 1 };
      }
    })
    .filter((v) => v);
};
