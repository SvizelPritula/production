import LoginInterface from "login/LoginInterface";
import PlayerInterface from "player/PlayerInterface";
import { useEffect, useState } from "react";
import { Manager } from "socket.io-client";

import { LoginState } from "types/loginState";
import { ManagerContext } from "utils/ManagerContext";
import Spinner from "utils/Spinner";

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
    const manager = new Manager("http://localhost:5000/", {
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
