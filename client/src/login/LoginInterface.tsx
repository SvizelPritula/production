import { useState } from "react";
import { LoginState } from "types/loginState";
import Spinner from "utils/Spinner";
import { useSocket } from "utils/useSocket";

interface ErrorLoginResult {
  success: false;
  reason: "unknown_code" | "bad_code";
}

interface PlayerLoginResult {
  success: true;
  kind: "player";
  player: string;
}

export type LoginResult = ErrorLoginResult | PlayerLoginResult;

interface EmitEvents {
  login: (code: string) => Promise<LoginResult>;
  logAccess: (element: string) => void;
}

interface ListenEvents {
  time: (time: number) => void;
}

export default function LoginInterface({
  setLoginState,
}: {
  setLoginState: (state: LoginState) => void;
}) {
  const { emitAck, connected } = useSocket<ListenEvents, EmitEvents>(
    "/",
    () => {},
    []
  );

  const [code, setCode] = useState("");
  const [locked, setLocked] = useState(false);
  const [error, setError] = useState<"none" | "bad_code" | "internal">("none");

  if (!connected) return <Spinner />;

  async function submit() {
    try {
      var realCode = code.toLowerCase();

      setLocked(true);

      var result = await emitAck("login", realCode);

      if (result.success) {
        switch (result.kind) {
          case "player":
            setError("none");
            setLoginState({
              kind: "player",
              id: result.player,
              code: realCode,
            });

            break;
          default:
            throw new Error(`Unexpected login kind ${result.kind}`);
        }
      } else {
        if (result.reason === "unknown_code") {
          setError("bad_code");
        } else {
          throw new Error(`Unexpected rejection reason ${result.reason}`);
        }
      }
    } catch (error) {
      console.error(error);
      setError("internal");
    } finally {
      setLocked(false);
    }
  }

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <label htmlFor="code">Login code:</label>

        {error !== "none" && (
          <div className="error">
            {error === "bad_code" && "Unknown login code"}
            {error === "internal" && "Interal error"}
          </div>
        )}

        <input
          id="code"
          type={"text"}
          autoComplete={"current-password"}
          disabled={locked}
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button type={"submit"} disabled={locked}>
          Submit
        </button>
      </form>
    </>
  );
}
