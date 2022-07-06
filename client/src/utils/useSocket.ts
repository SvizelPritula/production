import { useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { ManagerContext } from "./ManagerContext";

export interface SocketHandle {
  socket: Socket | null;
  connected: boolean;

  emit(event: string, ...args: string[]): void;
  emitAck(event: string, ...args: string[]): Promise<any>;
}

export function useSocket(namespace: string, attachEvents: (socket: Socket) => void): SocketHandle {
  const manager = useContext(ManagerContext);

  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    var socket = manager!.socket("/");
    socket.connect();
    setSocket(socket);

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    attachEvents(socket);

    return () => {
      socket.disconnect();
      setSocket(null);
    };
  }, [manager]);

  return {
    socket,
    connected,
    emit(event, ...args) {
      socket!.emit(event, ...args);
    },
    emitAck(event: string, ...args: string[]) {
      return new Promise((resolve, reject) => {
        var timeout: number | null = window.setTimeout(() => {
          if (timeout != null) {
            reject(new Error("Request timed out"));
            timeout = null;
          }
        }, 10000);

        socket!.emit(event, ...args, (result: any) => {
          if (timeout != null) {
            resolve(result);
            clearTimeout(timeout);
            timeout = null;
          }
        });
      });
    }
  }
}
