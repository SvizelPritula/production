import LoginInterface from "login/LoginInterface";
import PlayerInterface from "player/PlayerInterface";
import { ReactNode, useEffect, useState } from "react";
import { Manager } from "socket.io-client";

import { LoginState } from "types/loginState";
import { ManagerContext } from "utils/ManagerContext";
import Spinner from "components/Spinner";
import AdminInterface from "admin/AdminInterface";

function getMainComponent(
  state: LoginState,
  setState: (state: LoginState) => void,
  logout: () => void
): ReactNode {
  switch (state.kind) {
    case "none":
      return <LoginInterface setLoginState={setState} />;
    case "player":
      return <PlayerInterface loginState={state} logout={logout} />;
    case "admin":
      return <AdminInterface loginState={state} logout={logout} />;
  }
}

export default function App() {
  const [manager, setManager] = useState<Manager | null>(null);
  const [loginState, setLoginState] = useState<LoginState>({ kind: "none" });

  useEffect(() => {
    var url = new URL(window.location.toString());
    url.port = "5000";

    const manager = new Manager(url.toString(), {
      path: "/game",
    });

    setManager(manager);
  }, []);

  if (manager == null) return <Spinner />;

  function logout() {
    setLoginState({
      kind: "none",
    });
  }

  const mainComponent = getMainComponent(loginState, setLoginState, logout);

  return (
    <ManagerContext.Provider value={manager}>
      {mainComponent}
    </ManagerContext.Provider>
  );
}
