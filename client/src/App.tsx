import LoginInterface from "login/LoginInterface";
import PlayerInterface from "player/PlayerInterface";
import { useEffect, useState } from "react";
import { Manager } from "socket.io-client";

import { LoginState } from "types/loginState";
import { ManagerContext } from "utils/ManagerContext";
import Spinner from "components/Spinner";

function getMainComponent(
  state: LoginState,
  setState: (state: LoginState) => void
) {
  switch (state.kind) {
    case "none":
      return <LoginInterface setLoginState={setState}></LoginInterface>;
    case "player":
      return <PlayerInterface loginState={state}></PlayerInterface>;
  }
}

export default function App() {
  const [manager, setManager] = useState<Manager | null>(null);
  const [loginState, setLoginState] = useState<LoginState>({ kind: "none" });

  useEffect(() => {
    var url = new URL(window.location.toString());
    url.port = "5000";

    const manager = new Manager(url.toString(), {
      path: "/game"
    });

    setManager(manager);
  }, []);

  if (manager == null) return <Spinner />;

  const mainComponent = getMainComponent(loginState, setLoginState);

  return (
    <ManagerContext.Provider value={manager}>
      {mainComponent}
    </ManagerContext.Provider>
  );
}
