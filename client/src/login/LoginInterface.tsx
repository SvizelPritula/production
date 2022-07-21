import { useState } from "react";
import { LoginState } from "types/loginState";
import { useSocket } from "utils/useSocket";

import Layout from "components/Layout";
import Overlay from "components/Overlay";
import LoginHeader from "login/LoginHeader";

import styles from "login/LoginInterface.module.css";
import formStyles from "utils/forms.module.css";
import { useToasts } from "utils/useToasts";
import Toasts from "components/Toasts";
import { Toast, ToastType } from "types/toast";

interface ErrorLoginResult {
  success: false;
  reason: "unknown_code" | "bad_code";
}

interface SuccessfulLoginResult {
  success: true;
  kind: "player" | "board" | "admin";
}

export type LoginResult = ErrorLoginResult | SuccessfulLoginResult;

interface EmitEvents {
  login: (code: string) => Promise<LoginResult>;
}

interface ListenEvents {}

export default function LoginInterface({
  setLoginState,
}: {
  setLoginState: (state: LoginState) => void;
}) {
  const { emitAck, connected } = useSocket<ListenEvents, EmitEvents>(
    "/auth",
    {},
    () => {},
    []
  );

  const [code, setCode] = useState("");
  const [locked, setLocked] = useState(false);
  const [toasts, addToast] = useToasts<Toast>();

  function addError(message: string) {
    addToast({ message, kind: ToastType.Error });
  }

  async function submit() {
    try {
      var realCode = code.toLowerCase();

      setLocked(true);

      var result = await emitAck("login", realCode);

      if (result.success) {
        switch (result.kind) {
          case "player":
            setLoginState({
              kind: "player",
              code: realCode,
            });

            break;

          case "board":
            setLoginState({
              kind: "board",
              code: realCode,
            });

            break;

          case "admin":
            setLoginState({
              kind: "admin",
              code: realCode,
            });

            break;
          default:
            throw new Error(`Neznámý druh uživadele: "${result.kind}"`);
        }
      } else {
        if (result.reason === "unknown_code") {
          addError("Neznámý kód");
        } else {
          throw new Error(`Přihášení se nezdařilo z neznámého důvodu: "${result.reason}"`);
        }
      }
    } catch (error) {
      console.error(error);
      addError("Připojení k serveru se nezdařilo");
    } finally {
      setLocked(false);
    }
  }

  return (
    <Layout header={<LoginHeader online={connected} />}>
      <Overlay>
        <div className={styles["login-wrapper"]}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className={styles.login}
          >
            <label
              htmlFor="code"
              className={`${formStyles.label} ${styles.label}`}
            >
              Přihlašovací kód:
            </label>

            <input
              id="code"
              className={`${formStyles.input} ${styles.input}`}
              type={"password"}
              autoComplete={"current-password"}
              disabled={locked}
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button
              type={"submit"}
              className={formStyles.button}
              disabled={locked}
            >
              Odeslat
            </button>
          </form>
        </div>
        <Toasts toasts={toasts} />
      </Overlay>
    </Layout>
  );
}
