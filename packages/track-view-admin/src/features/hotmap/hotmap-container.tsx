import { useMemo } from 'react';
import { useAsync } from '@xinghunm/widgets';

import { Hotmap } from './hotmap';
import * as apis from './apis';
import { makeHotmapData } from './helpers';

export const HotmapContainer = () => {
  const fetchClickEventsState = useAsync(apis.fetchClickEvents, []);

  const data = useMemo(() => {
    const events = fetchClickEventsState.value?.data;
    if (events) {
      return makeHotmapData(events);
    }
  }, [fetchClickEventsState.value]);

  console.log('data', data);
  return <Hotmap data={data} />;
};
