import { useEffect, useState } from "react";

import { SuccessfulLoginState } from "types/loginState";
import { useSocket } from "utils/useSocket";
import { GameState } from "board/gameState";

import Layout from "components/Layout";
import BoardHeader from "board/BoardHeader";
import Spinner from "components/Spinner";
import GameStateDisplay from "./GameStateDisplay";

interface EmitEvents {}

interface ListenEvents {
  state: (state: GameState) => void;
}

export default function BoardInterface({
  loginState,
  logout,
}: {
  loginState: SuccessfulLoginState;
  logout: () => void;
}) {
  const [gameState, setGameState] = useState<GameState | null>(null);

  const { connected } = useSocket<ListenEvents, EmitEvents>(
    "/board",
    { auth: { code: loginState.code } },
    (socket) => {
      socket.on("connect_error", (error) => {
        if ((error as any)?.data?.reason === "bad_code") {
          logout();
        } else {
          console.error(error.message);
        }
      });

      socket.on("state", (state) => {
        setGameState(state);
      });
    },
    [loginState.code]
  );

  useEffect(() => {
    function handler(event: KeyboardEvent) {
      if (event.code === "Escape") {
        logout();
      }
    }

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  return (
    <Layout
      header={<BoardHeader online={connected} turn={gameState?.turn ?? null} />}
    >
      {gameState !== null ? <GameStateDisplay gameState={gameState}/> :<Spinner/>}
    </Layout>
  );
}
