import { useRef, useState } from "react";

export interface ToastInfo<T> {
  key: number,
  value: T,
  dismiss: () => void,
}

interface InternalToastInfo<T> {
  key: number,
  value: T
}

export function useToasts<T>(): [toasts: ToastInfo<T>[], addToast: (value: T) => number] {
  var nextKey = useRef(0);

  var [toasts, setToasts] = useState<InternalToastInfo<T>[]>([]);

  function addToast(value: T): number {
    var key = nextKey.current++;

    setToasts(toasts => {
      return toasts.concat([{ key, value }]);
    });

    return key;
  }

  return [
    toasts.map(({ key, value }) => ({
      key, value,
      dismiss() {
        setToasts(toasts => {
          return toasts.filter(t => t.key !== key);
        });
      },
    })),
    addToast
  ];
}
