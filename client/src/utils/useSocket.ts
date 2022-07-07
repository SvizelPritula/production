import { useCallback, useContext, useEffect, useState } from "react";
import { Socket, SocketOptions } from "socket.io-client";

import { ManagerContext } from "utils/ManagerContext";

type PromiseType<T> = T extends Promise<infer X> ? X : never
type FuncWithConcatedArguments<A extends [...args: any], B extends [...args: any]> = (...args: [...A, ...B]) => void;
type FuncReturningPromise = (...args: any) => Promise<any>;
type FuncReturningVoid = (...args: any) => void;
type CallbackConvertedFunc<F extends FuncReturningPromise> = FuncWithConcatedArguments<Parameters<F>, [callback: (result: PromiseType<ReturnType<F>>) => void]>;
type FuncReturningPromiseOrVoid = FuncReturningPromise | FuncReturningVoid;
type PotentiallyCallbackConvertedFunc<F extends FuncReturningPromiseOrVoid> = F extends FuncReturningPromise ? CallbackConvertedFunc<F> : F;
type PromiseEventMap = { [event: string]: any };
type CallbackConvertedEventMap<T extends PromiseEventMap> = { [K in keyof T]: PotentiallyCallbackConvertedFunc<T[K]> }
type KeysMatching<T extends object, V> = { [K in keyof T]: T[K] extends V ? K : never }[keyof T];

export type { PromiseEventMap };

export interface SocketHandle<ListenEvents, EmitEvents extends PromiseEventMap> {
  socket: Socket<ListenEvents, CallbackConvertedEventMap<EmitEvents>> | null;
  connected: boolean;

  emit<E extends keyof EmitEvents & string>(
    event: E,
    ...args: Parameters<CallbackConvertedEventMap<EmitEvents>[E]>
  ): void;

  emitAck<E extends KeysMatching<EmitEvents, FuncReturningPromise> & string>(
    event: E,
    ...args: Parameters<EmitEvents[E]>
  ): ReturnType<EmitEvents[E]>;
}

export function useSocket<ListenEvents, EmitEvents extends PromiseEventMap>(
  namespace: string,
  options: Partial<SocketOptions>,
  attachEvents: (socket: Socket<ListenEvents, CallbackConvertedEventMap<EmitEvents>>) => void,
  deps: any[]
): SocketHandle<ListenEvents, EmitEvents> {
  const manager = useContext(ManagerContext);

  const [socket, setSocket] = useState<Socket<ListenEvents, CallbackConvertedEventMap<EmitEvents>> | null>(null);
  const [connected, setConnected] = useState<boolean>(false);

  // Cannot add attachEvents as a dependency, since that would do nothing
  // eslint-disable-next-line
  const attachEventsCallback = useCallback(attachEvents, deps);

  useEffect(() => {
    var socket = manager!.socket(namespace, options);
    socket.connect();
    setSocket(socket);

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    attachEventsCallback(socket);

    return () => {
      socket.disconnect();
      setSocket(null);
    };

    // Cannot add options as a dependency, that would also keep disconnecting
    // Option changes have to be reflected in the dependency array
    // eslint-disable-next-line
  }, [manager, namespace, attachEventsCallback, ...deps]);

  return {
    socket,
    connected,
    emit(event, ...args) {
      (socket! as Socket).emit(event, ...args);
    },
    emitAck(event, ...args) {
      return new Promise((resolve, reject) => {
        (socket! as Socket).timeout(5000).emit(event, ...args, (error: any, result: any) => {
          if (error != null) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      }) as any;
    }
  }
}
