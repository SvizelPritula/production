import { ReactNode } from "react";

import styles from "components/Layout.module.css";

export default function LoginInterface({
  children,
  header,
  className,
}: {
  children: ReactNode;
  header: ReactNode;
  className?: string;
}) {
  return (
    <div className={styles.layout}>
      <header>{header}</header>
      <main className={className}>{children}</main>
    </div>
  );
}
