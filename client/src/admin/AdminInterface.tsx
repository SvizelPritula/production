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

interface ListenEvents {}

interface EmitEvents {
  advance_turn: () => Promise<Result>;
  set_time: (time: number) => Promise<Result>;
  add_time: (time: number) => Promise<Result>;
  start: (time: number) => Promise<Result>;
  suspend: () => Promise<Result>;
  pause: () => Promise<Result>;
  resume: () => Promise<Result>;
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

  async function handleResult(lambda: () => Promise<Result>) {
    try {
      var result = await lambda();

      if (!result.success) {
        addError(result.message);
      }
    } catch (error) {
      console.error(error);
      addError(`${error}`);
    }
  }

  const [timeValue, setTimeValue] = useState<string>("60");

  async function evaluateTurn() {
    await handleResult(() => emitAck("advance_turn"));
  }

  function withTime<T>(callback: (time: number) => T) {
    var time = parseInt(timeValue);

    if (isNaN(time)) {
      addError("Failed to parse time");
    } else {
      return callback(time * 1000);
    }
  }

  function setTime() {
    withTime((time) => handleResult(() => emitAck("set_time", time)));
  }

  function addTime() {
    withTime((time) => handleResult(() => emitAck("add_time", time)));
  }

  function start() {
    withTime((time) => handleResult(() => emitAck("start", time)));
  }

  function resume() {
    handleResult(() => emitAck("resume"));
  }

  function pause() {
    handleResult(() => emitAck("pause"));
  }

  function suspend() {
    handleResult(() => emitAck("suspend"));
  }

  return (
    <Layout header={<AdminHeader online={connected} logout={logout} />}>
      <Overlay>
        <div className={styles.wrapper}>
          <div className={styles.controls}>
            <h2>Game flow control</h2>
            <button className={formStyles.button} onClick={evaluateTurn}>
              Evaluate turn
            </button>

            <h2>Clock control</h2>
            <button className={formStyles.button} onClick={resume}>
              Start / Resume
            </button>
            <button className={formStyles.button} onClick={pause}>
              Pause
            </button>
            <button className={formStyles.button} onClick={suspend}>
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
            <button className={formStyles.button} onClick={setTime}>
              Set time
            </button>
            <button className={formStyles.button} onClick={addTime}>
              Add time
            </button>
            <button className={formStyles.button} onClick={start}>
              Set time and start
            </button>
          </div>
        </div>
        <Toasts toasts={toasts} />
      </Overlay>
    </Layout>
  );
}
