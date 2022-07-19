import { useState } from "react";

import { SuccessfulLoginState } from "types/loginState";
import { useSocket } from "utils/useSocket";

import Toasts from "components/Toasts";
import Layout from "components/Layout";
import Overlay from "components/Overlay";
import AdminHeader from "admin/AdminHeader";
import { useToasts } from "utils/useToasts";
import { Toast, ToastType } from "types/toast";

import styles from "admin/AdminInterface.module.css";
import formStyles from "utils/forms.module.css";

interface OkResult {
  success: true;
}

interface ErrorResult {
  success: false;
  message: string;
}

type Result = OkResult | ErrorResult;

interface ClockManagerTimings {
  timeForTurn: number;
  timeForCardDraw: number;
  specialTurnMultiplier: number;
}

interface ListenEvents {}

interface EmitEvents {
  advance_turn: () => Promise<Result>;

  set_time: (time: number) => Promise<Result>;
  add_time: (time: number) => Promise<Result>;
  start: (time: number) => Promise<Result>;
  suspend: () => Promise<Result>;
  pause: () => Promise<Result>;
  resume: () => Promise<Result>;

  set_restart_clock: (restart: boolean) => Promise<Result>;
  set_timings: (timings: ClockManagerTimings) => Promise<Result>;
}

export default function AdminInterface({
  loginState,
  logout,
}: {
  loginState: SuccessfulLoginState;
  logout: () => void;
}) {
  const { emitAck, connected } = useSocket<ListenEvents, EmitEvents>(
    "/admin",
    { auth: { code: loginState.code } },
    (socket) => {
      socket.on("connect_error", (error) => {
        if ((error as any)?.data?.reason === "bad_code") {
          logout();
        } else {
          console.error(error.message);
        }
      });
    },
    [loginState.code]
  );

  const [toasts, addToast] = useToasts<Toast>();

  function addError(message: string) {
    addToast({ message, kind: ToastType.Error });
  }

  function addSuccess(message: string) {
    addToast({ message, kind: ToastType.Success });
  }

  async function handleResult(
    lambda: () => Promise<Result>,
    successMessage: string
  ) {
    try {
      var result = await lambda();

      if (!result.success) {
        addError(result.message);
      } else {
        addSuccess(successMessage);
      }
    } catch (error) {
      console.error(error);
      addError(`${error}`);
    }
  }

  async function sendSimpleEvent(
    type: "advance_turn" | "resume" | "pause" | "suspend",
    successMessage: string
  ) {
    await handleResult(() => emitAck(type), successMessage);
  }

  const [timeValue, setTimeValue] = useState<string>("60");

  async function sendTimeEvent(
    type: "set_time" | "add_time" | "start",
    successMessage: string
  ) {
    var time = parseFloat(timeValue);

    if (!isFinite(time)) {
      addError("Failed to parse time");
    } else {
      await handleResult(
        () => emitAck(type, Math.floor(time * 1000)),
        successMessage
      );
    }
  }

  async function sendSetAutorestart(restart: boolean) {
    handleResult(
      () => emitAck("set_restart_clock", restart),
      restart ? "Enabled automatic restart" : "Disabled automatic restart"
    );
  }

  const [timeForTurnValue, setTimeForTurnValue] = useState<string>("15");
  const [timeForCardDrawValue, setTimeForCardDrawValue] =
    useState<string>("30");
  const [specialTurnMultiplierValue, setSpecialTurnMultiplierValue] =
    useState<string>("2");

  async function sendTimings() {
    var timeForTurn = parseFloat(timeForTurnValue);
    var timeForCardDraw = parseFloat(timeForCardDrawValue);
    var specialTurnMultiplier = parseFloat(specialTurnMultiplierValue);

    if (
      !isFinite(timeForTurn) ||
      !isFinite(timeForCardDraw) ||
      !isFinite(specialTurnMultiplier)
    ) {
      addError("Failed to parse time");
    } else {
      await handleResult(
        () =>
          emitAck("set_timings", {
            timeForTurn: Math.floor(timeForTurn * 1000),
            timeForCardDraw: Math.floor(timeForCardDraw * 1000),
            specialTurnMultiplier,
          }),
        "Saved timings"
      );
    }
  }

  return (
    <Layout header={<AdminHeader online={connected} logout={logout} />}>
      <Toasts toasts={toasts} />
      <div className={styles.wrapper}>
        <div className={styles.controls}>
          <h2>Game flow control</h2>
          <button
            className={formStyles.button}
            onClick={() => sendSimpleEvent("advance_turn", "Evaluated turn")}
          >
            Evaluate turn
          </button>

          <h2>Clock control</h2>

          <button
            className={formStyles.button}
            onClick={() => sendSimpleEvent("resume", "Resumed")}
          >
            Start / Resume
          </button>
          <button
            className={formStyles.button}
            onClick={() => sendSimpleEvent("pause", "Paused")}
          >
            Pause
          </button>
          <button
            className={formStyles.button}
            onClick={() => sendSimpleEvent("suspend", "Suspended")}
          >
            Suspend
          </button>

          <h3>Time adjustment</h3>

          <input
            id="code"
            className={formStyles.input}
            type={"number"}
            value={timeValue}
            onChange={(e) => setTimeValue(e.target.value)}
          />
          <button
            className={formStyles.button}
            onClick={() => sendTimeEvent("set_time", "Set time")}
          >
            Set time
          </button>
          <button
            className={formStyles.button}
            onClick={() => sendTimeEvent("add_time", "Added time")}
          >
            Add time
          </button>
          <button
            className={formStyles.button}
            onClick={() => sendTimeEvent("start", "Started")}
          >
            Set time and start
          </button>

          <h2>Clock manager configuration</h2>

          <button
            className={formStyles.button}
            onClick={() => sendSetAutorestart(true)}
          >
            Enable automatic timer restart
          </button>
          <button
            className={formStyles.button}
            onClick={() => sendSetAutorestart(false)}
          >
            Disable automatic timer restart
          </button>

          <h3>Timings</h3>

          <label className={formStyles.label} htmlFor="turn-time">
            Normal turn:
          </label>
          <input
            id="turn-time"
            className={formStyles.input}
            type={"number"}
            value={timeForTurnValue}
            onChange={(e) => setTimeForTurnValue(e.target.value)}
          />

          <label className={formStyles.label} htmlFor="draw-time">
            Normal card draw:
          </label>
          <input
            id="draw-time"
            className={formStyles.input}
            type={"number"}
            value={timeForCardDrawValue}
            onChange={(e) => setTimeForCardDrawValue(e.target.value)}
          />

          <label className={formStyles.label} htmlFor="special">
            Special turn multiplier:
          </label>
          <input
            id="special"
            className={formStyles.input}
            type={"number"}
            value={specialTurnMultiplierValue}
            onChange={(e) => setSpecialTurnMultiplierValue(e.target.value)}
          />

          <button className={formStyles.button} onClick={() => sendTimings()}>
            Save timings
          </button>
        </div>
      </div>
    </Layout>
  );
}
