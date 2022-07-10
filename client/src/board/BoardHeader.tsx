import { ReactNode } from "react";

import { Turn } from "types/turn";

import OnlineStatus from "components/OnlineStatus";
import Timer from "components/Timer";

import headerStyles from "components/Layout.module.css";

function getTurnName(turn: Turn | null): ReactNode {
  if (turn === null) return "Connecting...";

  switch (turn.phase) {
    case "card_draw":
      return (
        <>
          Round <b>{turn.round + 1}</b> - Drawing cards
        </>
      );

    case "card_usage":
      return (
        <>
          Round <b>{turn.round + 1}</b> - Turn <b>{turn.turn + 1}</b>
        </>
      );

    default:
      return "Unknown turn phase";
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
