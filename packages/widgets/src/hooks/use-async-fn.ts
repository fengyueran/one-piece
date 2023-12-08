import { useRef, useCallback, DependencyList, useState } from 'react';
import { useMounted } from './use-mounted';

export type AsyncState<T> = {
  loading: boolean;
  error?: Error | undefined;
  value?: T;
};

//@ts-ignore
// eslint-disable-next-line
export type FnReturnPromise = (...args: any[]) => Promise<any>;

type PromiseType<P extends Promise<any>> = P extends Promise<infer T>
  ? T
  : never;

type StateFromFunctionReturningPromise<T extends FnReturnPromise> = AsyncState<
  PromiseType<ReturnType<T>>
>;

export const useAsyncFn = <T extends FnReturnPromise>(
  fn: T,
  deps: DependencyList = [],
  initialState = { loading: false }
) => {
  const isMounted = useMounted();
  const lastCallId = useRef(0);
  const [state, setState] =
    useState<StateFromFunctionReturningPromise<T>>(initialState);

  const handler = useCallback(async (...args: Parameters<T>) => {
    const callId = ++lastCallId.current;
    //@ts-ignore
    // eslint-disable-next-line
    const updateState = (data: { error?: any; value?: any }) => {
      if (isMounted() && callId === lastCallId.current) {
        setState({ loading: false, ...data });
      }
    };

    try {
      setState({ loading: true });
      const value = await fn(...args);
      updateState({ value });
      return value;
    } catch (error) {
      updateState({ error });
      return error;
    }
  }, deps);

  return [state, handler] as [StateFromFunctionReturningPromise<T>, T];
};
