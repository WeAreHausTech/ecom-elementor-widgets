import { isEqual } from "lodash";
import { useRef } from "react";

export function usePreviousPersistent<T>(value: T) {
  const ref = useRef<{ value: T; prev: T | null }>({
    value: value,
    prev: null,
  });

  const current = ref.current.value;

  if (!isEqual(value, current)) {
    ref.current = {
      value: value,
      prev: current,
    };
  }

  return ref.current.prev;
}
