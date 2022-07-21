import { ReactNode } from "react";

import { Turn } from "types/turn";

import OnlineStatus from "components/OnlineStatus";
import Timer from "components/Timer";

import headerStyles from "components/Layout.module.css";

function getTurnName(turn: Turn | null): ReactNode {
  if (turn === null) return "Připojování...";

  switch (turn.phase) {
    case "card_draw":
      return (
        <>
          <b>{turn.round + 1}</b>. kolo - Dobírání
        </>
      );

    case "card_usage":
      return (
        <>
          <b>{turn.round + 1}</b>. kolo - <b>{turn.turn + 1}</b>. tah
        </>
      );

    case "before_game":
      return <><b>Generace</b> - Prosíme, vyčkejte&#x2026;</>;

    case "after_game":
      return <>Vyhodnocení</>;

    default:
      return "Neznámý táh";
  }
}

export default function BoardHeader({
  online,
  turn,
}: {
  online: boolean;
  turn: Turn | null;
}) {
  return (
    <>
      <h1 className={headerStyles.heading}>{getTurnName(turn)}</h1>
      <Timer />
      <OnlineStatus online={online} />
    </>
  );
}
