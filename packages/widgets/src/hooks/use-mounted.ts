import { useCallback, useEffect, useRef } from 'react';

export const useMounted = () => {
  const mountedRef = useRef<boolean>(false);
  const getMountedState = useCallback(() => mountedRef.current, []);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  return getMountedState;
};
