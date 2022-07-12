import React from "react";
import ReactDOM from "react-dom/client";
import { Manager } from "socket.io-client";

import { ManagerContext } from "utils/ManagerContext";
import { getLoginStateFromSessionStorage, getLoginStateFromUrl } from "utils/autologin";

import App from "App";

import "./index.css";

const manager = new Manager({
  path: "/game",
});

const initalLogin = getLoginStateFromUrl() ?? getLoginStateFromSessionStorage();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <ManagerContext.Provider value={manager}>
      <App initalLogin={initalLogin} />
    </ManagerContext.Provider>
  </React.StrictMode>
);
