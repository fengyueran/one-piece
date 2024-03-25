import { useCallback, useEffect, useRef, useState } from 'react';

export const useWebSocket = (url?: string, maxReconnectAttempts = 5) => {
  const reconnectAttempts = useRef(0);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const socket = useRef<WebSocket | null>(null);
  const [lastMessage, setLastMessage] =
    useState<WebSocketEventMap['message']['data']>();
  const shouldReconnect = useRef(true);

  const clearTimer = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const connect = useCallback(() => {
    clearTimer();

    if (!url) {
      console.log('WebSocket URL is not ready yet.');
      return;
    }

    if (
      socket.current &&
      socket.current.readyState !== WebSocket.CLOSED &&
      socket.current.readyState !== WebSocket.CLOSING
    ) {
      console.log(
        'WebSocket is already open or in the process of opening/closing.'
      );
      return;
    }

    if (socket.current?.readyState === WebSocket.OPEN) {
      socket.current.close();
    }
    try {
      socket.current = new WebSocket(url);
    } catch (error) {
      console.error('new WebSocket error', error);
      return;
    }

    socket.current.onopen = () => {
      console.log('WebSocket Connected');
      reconnectAttempts.current = 0;
    };

    socket.current.onmessage = (event) => {
      console.log('Message from server:', event.data);
      setLastMessage(event.data);
    };

    socket.current.onerror = () => {
      console.error('WebSocket Error');
    };

    socket.current.onclose = () => {
      console.log('WebSocket Disconnected');
      if (
        shouldReconnect.current &&
        reconnectAttempts.current < maxReconnectAttempts
      ) {
        timer.current = setTimeout(() => {
          console.log(
            `Attempting to reconnect (${
              reconnectAttempts.current + 1
            }/${maxReconnectAttempts})...`
          );
          reconnectAttempts.current++;
          connect();
        }, Math.pow(2, reconnectAttempts.current) * 1000);
      }
    };
  }, [url, maxReconnectAttempts]);

  useEffect(() => {
    connect();
    return () => {
      shouldReconnect.current = false;

      if (socket.current?.readyState === WebSocket.OPEN) {
        socket.current.close();
      }

      clearTimer();
    };
  }, [connect]);

  return { readyState: socket.current?.readyState, lastMessage };
};
