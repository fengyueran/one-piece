import { TrackSpear, Config } from '@xinghunm/track-spear';

export const init = (config: Config) => {
  new TrackSpear(config, (event) => {
    console.log('event', event);
  });
};
