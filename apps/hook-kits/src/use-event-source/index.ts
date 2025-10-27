'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import useEventCallback from '@/use-event-callback';

interface Props<T> {
  enabled?: boolean;
  initialState?: T[];
  url: string;
  event?: string;
  onOpen?: () => void;
  onResponse?: (chunk: T) => void;
  onError?: (error: Error | Event) => void;
  onCancel?: () => void;
}

const useEventSource = <T>({
  enabled = true,
  initialState,
  url,
  event = 'message',
  onOpen,
  onResponse,
  onError,
  onCancel,
}: Props<T>) => {
  const [state, setState] = useState(initialState || []);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const onOpenCallback = useEventCallback(onOpen);
  const onResponseCallback = useEventCallback(onResponse);
  const onErrorCallback = useEventCallback(onError);
  const onCancelCallback = useEventCallback(onCancel);

  const eventSourceRef = useRef<EventSource | null>(null);

  const cancelEventName = `event:cancel:${event}:${url}`;

  const cancelEventSource = useCallback(() => {
    window.dispatchEvent(new Event(cancelEventName));
  }, [cancelEventName]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const eventSource = new EventSource(url, { withCredentials: true });

    eventSourceRef.current = eventSource;

    setIsLoading(true);
    setIsError(false);

    const handleOpen = () => {
      onOpenCallback?.();
    };

    const handleError = (event: Event) => {
      setIsLoading(false);
      setIsError(true);
      onErrorCallback?.(
        event instanceof ErrorEvent ? (event.error ?? event) : event,
      );
      eventSource.close();
    };

    const handleMessage = ({ data }: MessageEvent<string>) => {
      try {
        const response = JSON.parse(data);

        setState((prev) => [...prev, response]);
        onResponseCallback?.(response);
      } catch (error) {
        onErrorCallback?.(error as Error);
      }
    };

    const handleCancelEventSource = () => {
      setIsLoading(false);

      if (eventSource.readyState !== EventSource.CLOSED) {
        onCancelCallback?.();
        eventSource.close();
      }
    };

    window.addEventListener(cancelEventName, handleCancelEventSource);
    eventSource.addEventListener('open', handleOpen);
    eventSource.addEventListener('error', handleError);
    eventSource.addEventListener(event, handleMessage);

    return () => {
      window.removeEventListener(cancelEventName, handleCancelEventSource);
      eventSource.removeEventListener('open', handleOpen);
      eventSource.removeEventListener('error', handleError);
      eventSource.removeEventListener(event, handleMessage);

      if (eventSource.readyState !== EventSource.CLOSED) {
        eventSource.close();
      }
    };
  }, [
    enabled,
    event,
    onCancelCallback,
    onErrorCallback,
    onResponseCallback,
    onOpenCallback,
    url,
    cancelEventName,
  ]);

  return {
    state,
    isLoading,
    isError,
    cancelEventSource,
    eventSource: eventSourceRef.current,
  };
};

export default useEventSource;
