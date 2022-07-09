import { ReactNode } from "react";

import { Turn } from "types/turn";
import { Player } from "player/playerData";

import OnlineStatus from "components/OnlineStatus";
import LogoutButton from "components/LogoutButton";

import styles from "player/PlayerHeader.module.css";

function getTurnName(turn: Turn | null): ReactNode {
  if (turn === null) return "Connecting...";

  switch (turn.phase) {
    case "card_draw":
      return "Drawing cards";

    case "card_usage":
      return (
        <>
          Turn <b>{turn.turn + 1}</b>
        </>
      );

    default:
      return "Unknown turn phase";
  }
}

export default function AdminHeader({
  player,
  turn,
  online,
  logout,
}: {
  player: Player | null;
  turn: Turn | null;
  online: boolean;
  logout: () => void;
}) {
  return (
    <>
      <div className={styles.heading}>
        <h1 className={styles.turn}>{getTurnName(turn)}</h1>
        <div className={styles.player}>{player?.name ?? "Loading..."}</div>
      </div>
      <LogoutButton logout={logout} />
      <OnlineStatus online={online} />
    </>
  );
}
