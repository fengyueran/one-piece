import { useLayoutEffect, useMemo, useState } from 'react';
import { useAsyncFn } from '@xinghunm/widgets';

import { Hotmap } from './hotmap';
import * as apis from './apis';
import { makeHotmapData } from './helpers';

export const HotmapContainer = () => {
  const [fetchClickEventsState, fetchClickEvents] = useAsyncFn(
    apis.fetchClickEvents,
    []
  );

  const [dimensions, setDimensions] = useState<number[]>([]);

  const data = useMemo(() => {
    const events = fetchClickEventsState.value?.data;
    if (events) {
      debugger;
      return makeHotmapData(events);
    }
  }, [fetchClickEventsState.value]);

  useLayoutEffect(() => {
    window.addEventListener('message', function (event) {
      if (event.data.type === 'iframeDimensions') {
        const { width, height } = event.data;
        setDimensions([width, height]);
        debugger;
        fetchClickEvents();
      }
    });
  }, [fetchClickEvents]);

  return <Hotmap data={data} dimensions={dimensions} />;
};
