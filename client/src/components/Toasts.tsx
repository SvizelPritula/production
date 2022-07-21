import { Toast, ToastType } from "types/toast";
import { ToastInfo } from "utils/useToasts";

import styles from "components/Toasts.module.css";

function getToastName(kind: ToastType): string {
  switch (kind) {
    case ToastType.Error:
      return "Chyba";
    case ToastType.Success:
      return "Úspěch";
  }
}

function getToastClassName(kind: ToastType): string {
  switch (kind) {
    case ToastType.Error:
      return "error";
    case ToastType.Success:
      return "success";
  }
}

export default function Toasts({ toasts }: { toasts: ToastInfo<Toast>[] }) {
  return (
    <div className={styles.container}>
      {toasts.map(({ value, key, dismiss }) => (
        <div
          className={`${styles.toast} ${styles[getToastClassName(value.kind)]}`}
          key={key}
        >
          <div className={styles.message}>
            <b>{getToastName(value.kind)}:</b> {value.message}
          </div>

          <button
            className={styles.button}
            onClick={dismiss}
            aria-label="Dismiss"
          >
            <svg
              className={styles.icon}
              viewBox="0 0 100 100"
              aria-hidden={true}
            >
              <line
                x1={25}
                y1={25}
                x2={75}
                y2={75}
                stroke="currentColor"
                strokeWidth={20}
                strokeLinecap="round"
              />
              <line
                x1={75}
                y1={25}
                x2={25}
                y2={75}
                stroke="currentColor"
                strokeWidth={20}
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
