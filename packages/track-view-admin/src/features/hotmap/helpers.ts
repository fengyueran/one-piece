import { Event } from './apis';

export const makeHotmapData = (events: { id: string; attributes: Event }[]) => {
  return events
    .map((e) => {
      const { selectorPath, offsetX, offsetY } = e.attributes.metaData as any;
      const targetElement = document.querySelector(selectorPath);
      console.log('selectorPath', selectorPath);
      if (targetElement) {
        const box = targetElement.getBoundingClientRect();
        const { left, top } = box;
        const x = left + offsetX;
        const y = top + offsetY;
        return { x, y, value: 40 };
      }
    })
    .filter((v) => v);
};
