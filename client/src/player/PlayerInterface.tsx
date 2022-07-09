import { SuccessfulLoginState } from "types/loginState";
import { useSocket } from "utils/useSocket";

import { ShadowState, useShadowState } from "utils/useShadowState";
import { useToasts } from "utils/useToasts";
import { Toast, ToastType } from "types/toast";
import { Player } from "player/playerData";
import { CardDrawTurnData, CardUsageTurnData, TurnData } from "player/turnData";

import Toasts from "components/Toasts";
import Layout from "components/Layout";
import Overlay from "components/Overlay";
import PlayerHeader from "player/PlayerHeader";
import { ReactNode, useState } from "react";
import CardDrawSelection from "./CardDrawSelection";
import Spinner from "components/Spinner";
import { Turn } from "types/turn";
import CardUsageSelection from "./CardUsageSelection";

interface EmitEvents {
  save_drawn_cards: (turn: Turn, selection: number[]) => Promise<void>;
  save_used_card: (turn: Turn, selection: number | null) => Promise<void>;
}

interface ListenEvents {
  player_info: (info: Player) => void;
  turn_info: (info: TurnData) => void;
  drawn_cards: (selection: number[]) => void;
  used_card: (selection: number | null) => void;
}

function getSelectionElements(
  turnData: TurnData | null,
  selection: ShadowState<number | null | number[]>,
  saveSelection: () => Promise<void>
): ReactNode {
  if (turnData == null) {
    return <Spinner />;
  }

  switch (turnData.turn.phase) {
    case "card_draw":
      return (
        <CardDrawSelection
          turnData={turnData as CardDrawTurnData}
          shadowState={selection as ShadowState<number[]>}
          saveSelection={saveSelection}
        />
      );
    case "card_usage":
      return (
        <CardUsageSelection
          turnData={turnData as CardUsageTurnData}
          shadowState={selection as ShadowState<number | null>}
          saveSelection={saveSelection}
        />
      );
    default:
      return <div>Unknown turn phase</div>;
  }
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

  const shadowState = useShadowState<number | null | number[]>(null);

  const { emitAck, connected } = useSocket<ListenEvents, EmitEvents>(
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

        switch (turn.turn.phase) {
          case "card_draw":
            shadowState.setMain([], true);
            break;
          case "card_usage":
            shadowState.setMain(null, true);
            break;
          default:
            shadowState.setMain(null, true);
        }
      });

      socket.on("drawn_cards", (selection) => {
        shadowState.setMain(selection);
      });

      socket.on("used_card", (selection) => {
        shadowState.setMain(selection);
      });
    },
    [loginState.code]
  );

  const [toasts, addToast] = useToasts<Toast>();

  function addError(message: string) {
    addToast({ message, kind: ToastType.Error });
  }

  async function saveSelection() {
    try {
      var selection = shadowState.value;

      switch (turnData?.turn.phase) {
        case "card_draw":
          await emitAck(
            "save_drawn_cards",
            turnData!.turn,
            selection as number[]
          );
          break;

        case "card_usage":
          await emitAck(
            "save_used_card",
            turnData!.turn,
            selection as number | null
          );
          break;
      }

      shadowState.setMain(selection, true);
    } catch (error) {
      console.error(error);
      addError("Failed to save selection");
    }
  }

  return (
    <Layout
      header={
        <PlayerHeader
          player={player}
          turn={turnData?.turn ?? null}
          online={connected}
          logout={logout}
        />
      }
    >
      <Overlay>
        {getSelectionElements(turnData, shadowState, saveSelection)}
        <Toasts toasts={toasts} />
      </Overlay>
    </Layout>
  );
}
