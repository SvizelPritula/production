import styles from "components/LogoutButton.module.css";
import headerStyles from "components/Layout.module.css";

export default function LogoutButton({ logout }: { logout: () => void }) {
  return (
    <button aria-label="Log out" onClick={logout} className={styles.button}>
      <svg
        viewBox="0 0 100 100"
        className={headerStyles.icon}
        aria-hidden={true}
      >
        <g
          strokeWidth={5}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          <path d="m 12.5,15 v 60 l 35,10 V 25 Z" />
          <path d="m 12.5,15 h 55 v 20" />
          <path d="m 67.5,55 v 20 h -20" />
          <path d="m 57.5,45 h 30" />
          <path d="m 77.5,35 10,10" />
          <path d="m 77.5,55 10,-10" />
        </g>
      </svg>
    </button>
  );
}
