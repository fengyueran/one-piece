import { Event } from './apis';

export const calcPvAndUv = (events: { id: string; attributes: Event }[]) => {
  let pv = 0;
  let uv = 0;
  events.forEach((e) => {
    if (e.attributes.type === 'RouteChange') {
      pv++;
    }
    if (e.attributes.type === 'NewVisitor') {
      uv++;
    }
  });

  return { pv, uv };
};
