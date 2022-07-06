import { createContext } from "react";
import { Manager } from "socket.io-client";

export const ManagerContext = createContext<Manager | null>(null);
