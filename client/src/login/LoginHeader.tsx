import OnlineStatus from "components/OnlineStatus";

import headerStyles from "components/Layout.module.css";

export default function LoginHeader({ online }: { online: boolean }) {
  return (
    <>
      <h1 className={headerStyles.heading}>Přihlášení</h1>
      <OnlineStatus online={online} />
    </>
  );
}
