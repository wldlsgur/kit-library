'use client';

import { useEffect } from 'react';

import useEventCallback from '@/use-event-callback';

const MODIFIER_KEYS = ['ctrl', 'shift', 'alt', 'meta'];

type ModifierKey = 'Ctrl' | 'Shift' | 'Alt' | 'Meta';
type NormalKey = string;

interface Props {
  keys: [NormalKey] | [...ModifierKey[], NormalKey] | ModifierKey[];
  callback: () => void;
}

const useHotKeys = ({ keys, callback }: Props) => {
  const callbackRef = useEventCallback(callback);

  useEffect(() => {
    const lowerKeys = keys.map((key) => key.toLowerCase());
    const modifiers = {
      ctrl: lowerKeys.includes('ctrl'),
      shift: lowerKeys.includes('shift'),
      alt: lowerKeys.includes('alt'),
      meta: lowerKeys.includes('meta'),
    };
    const normalKey = lowerKeys.find((key) => !MODIFIER_KEYS.includes(key));

    const handleKeyDown = (event: KeyboardEvent) => {
      if (modifiers.ctrl !== event.ctrlKey) {
        return;
      }
      if (modifiers.shift !== event.shiftKey) {
        return;
      }
      if (modifiers.alt !== event.altKey) {
        return;
      }
      if (modifiers.meta !== event.metaKey) {
        return;
      }
      if (normalKey && event.key.toLowerCase() !== normalKey) {
        return;
      }
      if (!normalKey && !Object.values(modifiers).some(Boolean)) {
        return;
      }

      event.preventDefault();
      callbackRef();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [keys, callbackRef]);
};

export default useHotKeys;
