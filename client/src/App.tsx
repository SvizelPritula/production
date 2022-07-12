import { useState } from "react";

import { LoginState } from "types/loginState";
import { saveLoginStateToSessionStorage } from "utils/autologin";

import AdminInterface from "admin/AdminInterface";
import BoardInterface from "board/BoardInterface";
import LoginInterface from "login/LoginInterface";
import PlayerInterface from "player/PlayerInterface";

export default function App({
  initalLogin,
}: {
  initalLogin: LoginState | null;
}) {
  const [loginState, setLoginStateRaw] = useState<LoginState>(
    initalLogin ?? { kind: "none" }
  );

  function setLoginState(state: LoginState) {
    setLoginStateRaw(state);
    saveLoginStateToSessionStorage(state);
  }

  function logout() {
    setLoginState({
      kind: "none",
    });
  }

  switch (loginState.kind) {
    case "none":
      return <LoginInterface setLoginState={setLoginState} />;
    case "player":
      return <PlayerInterface loginState={loginState} logout={logout} />;
    case "board":
      return <BoardInterface loginState={loginState} logout={logout} />;
    case "admin":
      return <AdminInterface loginState={loginState} logout={logout} />;
  }
}
