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

interface EmitEvents {
  advance_turn: () => Promise<void>;
}

interface ListenEvents {}

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

  async function evaluateTurn() {
    try {
      await emitAck("advance_turn");
    } catch (error) {
      console.error(error);
      addError(`Error while evaluating turn: ${error}`);
    }
  }

  return (
    <Layout header={<AdminHeader online={connected} logout={logout} />}>
      <Overlay>
        <div className={styles.wrapper}>
          <div className={styles.controls}>
            <button className={formStyles.button} onClick={evaluateTurn}>
              Evaluate turn
            </button>
          </div>
        </div>
        <Toasts toasts={toasts} />
      </Overlay>
    </Layout>
  );
}
