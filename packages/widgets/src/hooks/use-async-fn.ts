//@ts-nocheck
import {
  useEffect,
  RefObject,
  useCallback,
  DependencyList,
  useState,
} from 'react';

export type AsyncState<T> =
  | {
      loading: boolean;
      error?: undefined;
      value?: undefined;
    }
  | {
      loading: true;
      error?: Error | undefined;
      value?: T;
    }
  | {
      loading: false;
      error: Error;
      value?: undefined;
    }
  | {
      loading: false;
      error?: undefined;
      value: T;
    };

//@ts-ignore
// eslint-disable-next-line
type FnReturnPromise = (...args: any[]) => Promise<any>;

export const useAsyncFn = <T extends FnReturnPromise>() =>
  // fn: T,
  // deps: DependencyList = []
  {
    // const [state, setState] = useState<AsyncState<T>>();
    // const handler = useCallback(async (...args: Parameters<T>) => {
    //   try {
    //     setState({ loading: true });
    //     const data = await fn(...args);
    //   } catch (error) {}
    // }, deps);
    // return [state, handler];
  };
