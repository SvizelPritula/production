import { ReactNode } from "react";

import styles from "player/InfoText.module.css";

export default function CardDrawSelection({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.text}>{children}</div>
    </div>
  );
}
