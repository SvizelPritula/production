import { SuccessfulLoginState } from "types/loginState";
import { useSocket } from "utils/useSocket";

import { useToasts } from "utils/useToasts";
import { Toast, ToastType } from "types/toast";
import { Player } from "player/playerData";
import { TurnData } from "player/turnData";

import Toasts from "components/Toasts";
import Layout from "components/Layout";
import Overlay from "components/Overlay";
import PlayerHeader from "player/PlayerHeader";
import { useState } from "react";

interface EmitEvents {}

interface ListenEvents {
  player_info: (info: Player) => void;
  turn_info: (info: TurnData) => void;
}

export default function PlayerInterface({
  loginState,
  logout,
}: {
  loginState: SuccessfulLoginState;
  logout: () => void;
}) {
  const [player, setPlayer] = useState<Player | null>(null);
  const [turnData, setTurnData] = useState<TurnData | null>(null);

  const { connected } = useSocket<ListenEvents, EmitEvents>(
    "/player",
    { auth: { code: loginState.code } },
    (socket) => {
      socket.on("connect_error", (error) => {
        if ((error as any)?.data?.reason === "bad_code") {
          logout();
        } else {
          console.error(error.message);
        }
      });

      socket.on("player_info", (player) => {
        setPlayer(player);
      });

      socket.on("turn_info", (turn) => {
        setTurnData(turn);
      });
    },
    [loginState.code]
  );

  const [toasts, addToast] = useToasts<Toast>();

  function addError(message: string) {
    addToast({ message, kind: ToastType.Error });
  }

  return (
    <Layout
      header={
        <PlayerHeader player={player} online={connected} logout={logout} />
      }
    >
      <Overlay>
        <div>
          <pre>{JSON.stringify(turnData, null, 2)}</pre>
        </div>
        <Toasts toasts={toasts} />
      </Overlay>
    </Layout>
  );
}
