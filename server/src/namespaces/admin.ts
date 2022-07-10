import { Namespace, Server } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { Clock } from "src/clock";
import { ClockManager } from "src/clock_manager";
import { Game } from "src/game/game";
import { UserError } from "src/game/types";
import { loginByCode } from "src/login";

interface OkResult {
    success: true;
}

interface ErrorResult {
    success: false;
    message: string;
}

type Result = OkResult | ErrorResult;

interface AdminServerToClientEvents { }

interface AdminClientToServerEvents {
    advance_turn: (callback: (error: Result) => void) => void;
    set_time: (time: number, callback: (error: Result) => void) => void;
    add_time: (time: number, callback: (error: Result) => void) => void;
    start: (time: number, callback: (error: Result) => void) => void;
    suspend: (callback: (error: Result) => void) => void;
    pause: (callback: (error: Result) => void) => void;
    resume: (callback: (error: Result) => void) => void;
}

export function registerAdminNamespace(server: Server, game: Game, clock: Clock, clockManager: ClockManager) {
    const registry = game.registry;

    const adminNamespace: Namespace<AdminClientToServerEvents, AdminServerToClientEvents, {}, {}> = server.of("/admin");

    adminNamespace.use((socket, next) => {
        var code = socket.handshake.auth?.code;

        if (typeof code === "string") {
            var result = loginByCode(code, registry);

            if (result.success && result.kind === "admin") {
                next();
                return;
            }
        }

        var error: ExtendedError = new Error("Invalid code");
        error.data = { reason: "bad_code" };
        next(error);
    });

    adminNamespace.on("connection", (socket) => {
        socket.on("advance_turn", (callback) => {
            if (typeof callback !== "function")
                return;

            game.evaluateTurn();
            callback({ success: true });
        });

        socket.on("set_time", (time: number, callback: (error: Result) => void) => {
            if (typeof callback !== "function")
                return;

            if (typeof time !== "number" || !isFinite(time)) {
                callback({ success: false, message: "Invalid time" });
                return
            }

            callback(createResult(() => clock.setTime(time)));
        });

        socket.on("add_time", (time: number, callback: (error: Result) => void) => {
            if (typeof callback !== "function")
                return;

            if (typeof time !== "number" || !isFinite(time)) {
                callback({ success: false, message: "Invalid time" });
                return
            }

            callback(createResult(() => clock.addTime(time)));
        });

        socket.on("start", (time: number, callback: (error: Result) => void) => {
            if (typeof callback !== "function")
                return;

            if (typeof time !== "number" || !isFinite(time)) {
                callback({ success: false, message: "Invalid time" });
                return
            }


            callback(createResult(() => clock.start(time)));
        });

        socket.on("suspend", (callback: (error: Result) => void) => {
            if (typeof callback !== "function")
                return;


            callback(createResult(() => clock.suspend()));
        });

        socket.on("pause", (callback: (error: Result) => void) => {
            if (typeof callback !== "function")
                return;

            callback(createResult(() => clock.pause()));
        });

        socket.on("resume", (callback: (error: Result) => void) => {
            if (typeof callback !== "function")
                return;

            callback(createResult(() => {
                if (clock.state.state === "suspended") {
                    var newTime = clockManager.getTurnDuration(game.state.turn);

                    if (newTime != null) {
                        clock.start(newTime);
                    } else {
                        throw new UserError("Failed to calculate time for next turn");
                    }
                } else {
                    clock.resume();
                }
            }));
        });
    });

    function createResult(callback: () => void): Result {
        try {
            callback();
            return { success: true };
        } catch (error) {
            if (error instanceof UserError) {
                return { success: false, message: error.message };
            } else {
                throw error;
            }
        }
    }
}
