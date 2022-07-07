import OnlineStatus from "components/OnlineStatus";
import LogoutButton from "components/LogoutButton";
import { Player } from "player/playerData";

import headerStyles from "components/Layout.module.css";

export default function AdminHeader({
  player,
  online,
  logout,
}: {
  player: Player | null;
  online: boolean;
  logout: () => void;
}) {
  return (
    <>
      <h1 className={headerStyles.heading}>
        {player != null ? player.name : "Loading..."}
      </h1>
      <LogoutButton logout={logout} />
      <OnlineStatus online={online} />
    </>
  );
}
