import { useState } from "react";

import { SuccessfulLoginState } from "types/loginState";
import { useSocket } from "utils/useSocket";

import Toasts from "components/Toasts";
import Layout from "components/Layout";
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

interface ListenEvents {
  set_saves: (names: string[]) => void;
  add_save: (name: string) => void;
}

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

  load: (name: string) => Promise<Result>;
  new_game: () => Promise<Result>;
}

export default function AdminInterface({
  loginState,
  logout,
}: {
  loginState: SuccessfulLoginState;
  logout: () => void;
}) {
  const [saveNames, setSaveNames] = useState<string[]>([]);

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

      socket.on("set_saves", (names) => {
        setSaveNames(names);
      });

      socket.on("add_save", (name) => {
        setSaveNames((names) =>
          names.concat(names.includes(name) ? [] : [name])
        );
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
      addError("Neplatný čas");
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
      restart ? "Obnovení časovače zapnuto" : "Obnovení časovače vypnuto"
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
      addError("Neplatný čas");
    } else {
      await handleResult(
        () =>
          emitAck("set_timings", {
            timeForTurn: Math.floor(timeForTurn * 1000),
            timeForCardDraw: Math.floor(timeForCardDraw * 1000),
            specialTurnMultiplier,
          }),
        "Trvání tahů uloženo"
      );
    }
  }

  const [saveNameValue, setSaveNameValue] = useState<string>("new");

  var name: string | null = null;

  if (saveNameValue.startsWith("s")) {
    name = saveNameValue.slice(1);

    if (!saveNames.includes(name)) {
      name = null;
    }
  }

  async function loadSave() {
    if (name != null) {
      await handleResult(() => emitAck("load", name!), `Načten stav ${name}`);
    } else {
      await handleResult(() => emitAck("new_game"), `Zahájena nová hra`);
    }
  }

  return (
    <Layout header={<AdminHeader online={connected} logout={logout} />}>
      <Toasts toasts={toasts} />
      <div className={styles.wrapper}>
        <div className={styles.controls}>
          <h2>Průběh hry</h2>
          <button
            className={formStyles.button}
            onClick={() => sendSimpleEvent("advance_turn", "Tah vyhodnocen")}
          >
            Vyhodnotit tah
          </button>

          <h2>Časovač</h2>

          <button
            className={formStyles.button}
            onClick={() => sendSimpleEvent("resume", "Časovač spuštěn")}
          >
            Spustit / Pokračovat
          </button>
          <button
            className={formStyles.button}
            onClick={() => sendSimpleEvent("pause", "Časovač pozastaven")}
          >
            Pozastavit
          </button>
          <button
            className={formStyles.button}
            onClick={() => sendSimpleEvent("suspend", "Časovač zastaven")}
          >
            Zastavit
          </button>

          <h3>Nastavení času</h3>

          <input
            id="code"
            className={formStyles.input}
            type={"number"}
            value={timeValue}
            onChange={(e) => setTimeValue(e.target.value)}
          />
          <button
            className={formStyles.button}
            onClick={() => sendTimeEvent("set_time", "Čas nastaven")}
          >
            Nastavit čas
          </button>
          <button
            className={formStyles.button}
            onClick={() => sendTimeEvent("add_time", "Čas přidán")}
          >
            Přidat čas
          </button>
          <button
            className={formStyles.button}
            onClick={() => sendTimeEvent("start", "Časovat nastaven a spuštěn")}
          >
            Nastavit čas a spustit
          </button>

          <h2>Ovladač hodin</h2>

          <button
            className={formStyles.button}
            onClick={() => sendSetAutorestart(true)}
          >
            Zapnout automatické obnovení časovače
          </button>
          <button
            className={formStyles.button}
            onClick={() => sendSetAutorestart(false)}
          >
            Vypnout automatické obnovení časovače
          </button>

          <h3>Časové limity</h3>

          <label className={formStyles.label} htmlFor="turn-time">
            Normální tah:
          </label>
          <input
            id="turn-time"
            className={formStyles.input}
            type={"number"}
            value={timeForTurnValue}
            onChange={(e) => setTimeForTurnValue(e.target.value)}
          />

          <label className={formStyles.label} htmlFor="draw-time">
            Normální dobírání:
          </label>
          <input
            id="draw-time"
            className={formStyles.input}
            type={"number"}
            value={timeForCardDrawValue}
            onChange={(e) => setTimeForCardDrawValue(e.target.value)}
          />

          <label className={formStyles.label} htmlFor="special">
            Součinitel pro speciální tah:
          </label>
          <input
            id="special"
            className={formStyles.input}
            type={"number"}
            value={specialTurnMultiplierValue}
            onChange={(e) => setSpecialTurnMultiplierValue(e.target.value)}
          />

          <button className={formStyles.button} onClick={() => sendTimings()}>
            Uložit
          </button>

          <h2>Uložené hry</h2>

          <label className={formStyles.label} htmlFor="save-name">
            Název souboru:
          </label>

          <select
            id="save-name"
            className={formStyles.input}
            value={name != null ? "s" + name : "new"}
            onChange={(e) => setSaveNameValue(e.target.value)}
          >
            <option value="new">Nová hra</option>

            {saveNames.map((name) => (
              <option value={"s" + name} key={name}>
                {name}
              </option>
            ))}
          </select>

          <button className={formStyles.button} onClick={() => loadSave()}>
            Načíst
          </button>
        </div>
      </div>
    </Layout>
  );
}
