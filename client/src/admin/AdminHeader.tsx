import OnlineStatus from "components/OnlineStatus";

import headerStyles from "components/Layout.module.css";
import LogoutButton from "components/LogoutButton";

export default function AdminHeader({
  online,
  logout,
}: {
  online: boolean;
  logout: () => void;
}) {
  return (
    <>
      <h1 className={headerStyles.heading}>Ovládání hry</h1>
      <LogoutButton logout={logout} />
      <OnlineStatus online={online} />
    </>
  );
}
