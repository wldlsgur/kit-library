import { useCallback, useState } from 'react';

const useCopyClipBoard = () => {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copy = useCallback(async (text: string) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
    } catch (error) {
      console.error('Copy failed', error);
      setCopiedText(null);
    }
  }, []);

  return { copiedText, copy };
};

export default useCopyClipBoard;
