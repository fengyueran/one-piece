import { useEffect, useLayoutEffect, useState } from 'react';
import { useAsyncFn } from '@xinghunm/widgets';

import { Hotmap } from './hotmap';
import * as apis from './apis';
import { makeHotmapData, HotmapData } from './helpers';

export const HotmapContainer = () => {
  const [data, setData] = useState<HotmapData[]>();
  const [fetchClickEventsState, fetchClickEvents] = useAsyncFn(
    apis.fetchClickEvents,
    []
  );

  const [dimensions, setDimensions] = useState<number[]>([]);

  useEffect(() => {
    const getData = async () => {
      const events = fetchClickEventsState.value?.data;
      if (events) {
        const data = await makeHotmapData(events);
        setData(data);
      }
    };
    getData();
  }, [fetchClickEventsState.value]);

  useLayoutEffect(() => {
    window.addEventListener('message', function (event) {
      if (event.data.type === '__IframeDimensions__') {
        const { width, height } = event.data;
        setDimensions([width, height]);
        fetchClickEvents();
      }
    });
  }, [fetchClickEvents]);

  return <Hotmap data={data} dimensions={dimensions} />;
};
