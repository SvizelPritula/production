import { ReactNode } from "react";

import styles from "components/Overlay.module.css";

export default function LoginInterface({ children }: { children: ReactNode }) {
  return <div className={styles.container}>{children}</div>;
}
