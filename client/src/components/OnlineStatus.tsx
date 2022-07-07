import headerStyles from "components/Layout.module.css";

export default function OnlineStatus({ online }: { online: boolean }) {
  if (online) {
    return (
      <svg viewBox="0 0 100 100" className={headerStyles.icon}>
        <circle cx={50} cy={50} r={40} fill="green" />
      </svg>
    );
  } else {
    return (
      <svg viewBox="0 0 100 100" className={headerStyles.icon}>
        <circle cx={50} cy={50} r={40} fill="red" />
      </svg>
    );
  }
}
