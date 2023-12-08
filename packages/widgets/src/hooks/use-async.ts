import { DependencyList, useEffect } from 'react';

import { useAsyncFn, FnReturnPromise } from './use-async-fn';

export const useAsync = <T extends FnReturnPromise>(
  fn: T,
  deps: DependencyList = []
) => {
  const [state, handler] = useAsyncFn(fn, deps, {
    loading: true,
  });

  useEffect(() => {
    handler();
  }, [handler]);

  return state;
};
