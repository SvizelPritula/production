import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Socket, SocketOptions } from "socket.io-client";

import { ManagerContext } from "utils/ManagerContext";

type PromiseType<T> = T extends Promise<infer X> ? X : never;
type FuncWithConcatedArguments<
  A extends [...args: any],
  B extends [...args: any]
> = (...args: [...A, ...B]) => void;
type FuncReturningPromise = (...args: any) => Promise<any>;
type FuncReturningVoid = (...args: any) => void;
type CallbackConvertedFunc<F extends FuncReturningPromise> =
  FuncWithConcatedArguments<
    Parameters<F>,
    [callback: (result: PromiseType<ReturnType<F>>) => void]
  >;
type FuncReturningPromiseOrVoid = FuncReturningPromise | FuncReturningVoid;
type PotentiallyCallbackConvertedFunc<F extends FuncReturningPromiseOrVoid> =
  F extends FuncReturningPromise ? CallbackConvertedFunc<F> : F;
type PromiseEventMap = { [event: string]: any };
type CallbackConvertedEventMap<T extends PromiseEventMap> = {
  [K in keyof T]: PotentiallyCallbackConvertedFunc<T[K]>;
};
type KeysMatching<T extends object, V> = {
  [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

export type { PromiseEventMap };

type Emit<EmitEvents extends PromiseEventMap> = <
  E extends keyof EmitEvents & string
>(
  event: E,
  ...args: Parameters<CallbackConvertedEventMap<EmitEvents>[E]>
) => void;

type EmitAck<EmitEvents extends PromiseEventMap> = <
  E extends KeysMatching<EmitEvents, FuncReturningPromise> & string
>(
  event: E,
  ...args: Parameters<EmitEvents[E]>
) => ReturnType<EmitEvents[E]>;

export interface SocketHandle<
  ListenEvents,
  EmitEvents extends PromiseEventMap
> {
  socket: Socket<ListenEvents, CallbackConvertedEventMap<EmitEvents>>;
  connected: boolean;

  emit: Emit<EmitEvents>;
  emitAck: EmitAck<EmitEvents>;
}

export function useSocket<ListenEvents, EmitEvents extends PromiseEventMap>(
  namespace: string,
  options: Partial<SocketOptions>,
  attachEvents: (
    socket: Socket<ListenEvents, CallbackConvertedEventMap<EmitEvents>>,
    emit: Emit<EmitEvents>,
    emitAck: EmitAck<EmitEvents>
  ) => void | (() => void),
  deps: any[]
): SocketHandle<ListenEvents, EmitEvents> {
  const manager = useContext(ManagerContext);

  const socket = useMemo<
    Socket<ListenEvents, CallbackConvertedEventMap<EmitEvents>>
  >(
    () => manager!.socket(namespace, { ...options }),
    [manager, namespace, options]
  );

  const [connected, setConnected] = useState<boolean>(false);

  // Cannot add attachEvents as a dependency, since that would do nothing
  // eslint-disable-next-line
  const attachEventsCallback = useCallback(attachEvents, deps);

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    var cleanup = attachEventsCallback(
      socket,
      createEmit(socket),
      createEmitAck(socket)
    );

    return () => {
      socket.disconnect();

      if (cleanup != null) cleanup();
    };
  }, [socket, attachEventsCallback]);

  return {
    socket,
    connected,
    emit: createEmit(socket),
    emitAck: createEmitAck(socket),
  };
}

function createEmit<EmitEvents extends PromiseEventMap>(
  socket: Socket
): Emit<EmitEvents> {
  return (event, ...args) => {
    (socket as Socket).emit(event, ...args);
  };
}

function createEmitAck<EmitEvents extends PromiseEventMap>(
  socket: Socket
): EmitAck<EmitEvents> {
  return (event, ...args) => {
    return new Promise((resolve, reject) => {
      (socket as Socket)
        .timeout(5000)
        .emit(event, ...args, (error: any, result: any) => {
          if (error != null) {
            reject(error);
          } else {
            resolve(result);
          }
        });
    }) as any;
  };
}
