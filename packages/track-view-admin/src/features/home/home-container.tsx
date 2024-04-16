import { useMemo } from 'react';
import { useAsync } from '@xinghunm/widgets';

import { Home } from './home';
import * as apis from './apis';
import { calcPvAndUv } from './helpers';

export const HomeContainer = () => {
  const fetchEventsState = useAsync(apis.fetchEvents, []);

  const stats = useMemo(() => {
    const events = fetchEventsState.value?.data;
    if (events) {
      return calcPvAndUv(events);
    }
  }, [fetchEventsState.value]);
  console.log('stats', stats);
  return <Home pv={stats?.pv} uv={stats?.uv} />;
};
