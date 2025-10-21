'use client';

import { ChangeEvent, useCallback, useState } from 'react';

const useInput = <T>(initialValue: T) => {
  const [value, setValue] = useState(initialValue);

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValue(event.target.value as T);
    },
    [],
  );

  const handleFieldChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value: newValue } = event.target;

      setValue((prev) => ({ ...prev, [name]: newValue }));
    },
    [],
  );

  const resetValue = useCallback(() => {
    setValue(initialValue);
  }, [initialValue]);

  return {
    value,
    handleInputChange,
    handleFieldChange,
    resetValue,
  };
};

export default useInput;
