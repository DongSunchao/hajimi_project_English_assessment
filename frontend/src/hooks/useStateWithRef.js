import { useState, useRef } from 'react';

export const useStateWithRef = (initial) => {
  const [val, setVal] = useState(initial);
  const ref = useRef(initial);
  const set = (v) => { ref.current = v; setVal(v); };
  return [val, set, ref];
};
