import { ReactNode } from "react";

import { Turn } from "types/turn";
import { Player } from "player/playerData";

import OnlineStatus from "components/OnlineStatus";
import LogoutButton from "components/LogoutButton";

import styles from "player/PlayerHeader.module.css";

function getTurnName(turn: Turn | null): ReactNode {
  if (turn === null) return "Připojování...";

  switch (turn.phase) {
    case "card_draw":
      return "Dobírání";

    case "card_usage":
      return (
        <>
          <b>{turn.turn + 1}</b>. tah
        </>
      );

    case "before_game":
      return <>Generace</>;

    case "after_game":
      return <>Vyhodnocení</>;

    default:
      return "Neznámý tah";
  }
}

export default function PlayerHeader({
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
        <div className={styles.player}>{player?.name ?? "Načítání..."}</div>
      </div>
      <LogoutButton logout={logout} />
      <OnlineStatus online={online} />
    </>
  );
}
