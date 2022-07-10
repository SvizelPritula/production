import { Namespace, Server } from "socket.io";
import { Clock, ClockState } from "src/clock";
import { Throttle } from "src/throttle";

interface ClockServerToClientEvents {
    "state": (state: ClockState) => void;
}

interface ClockClientToServerEvents {
    "get_time": (callback: (time: number) => void) => void;
}

export function registerClockNamespace(server: Server, clock: Clock) {
    const clockNamespace: Namespace<ClockClientToServerEvents, ClockServerToClientEvents, {}, {}> = server.of("/clock");

    const throttle = new Throttle<ClockState>(10);

    clockNamespace.on("connection", (socket) => {
        socket.emit("state", clock.state);

        socket.on("get_time", callback => {
            if (typeof callback !== "function")
                return;
                
            callback(Date.now());
        });
    });

    clock.on("state_change", state => {
        throttle.send(state);
    });

    throttle.on("event", state => {
        clockNamespace.emit("state", state);
    });
}
