/**
 * useStateWithRef Hook
 * 
 * Combines useState and useRef for situations where you need
 * both reactive state and a stable reference (e.g., in callbacks).
 */

import { useState, useRef, useCallback } from 'react';

export function useStateWithRef<T>(initialValue: T): [T, (value: T) => void, React.MutableRefObject<T>] {
  const [state, setState] = useState<T>(initialValue);
  const ref = useRef<T>(initialValue);

  const setStateAndRef = useCallback((value: T) => {
    ref.current = value;
    setState(value);
  }, []);

  return [state, setStateAndRef, ref];
}
