import { Namespace, Server } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { isInt, isObject, isReal } from "src/assert";
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

type Callback = (error: Result) => void;

interface ClockManagerTimings {
    timeForTurn: number;
    timeForCardDraw: number;
    specialTurnMultiplier: number;
}

interface AdminServerToClientEvents { }

interface AdminClientToServerEvents {
    advance_turn: (callback: Callback) => void;

    // Clock management
    set_time: (time: number, callback: Callback) => void;
    add_time: (time: number, callback: Callback) => void;
    start: (time: number, callback: Callback) => void;
    suspend: (callback: Callback) => void;
    pause: (callback: Callback) => void;
    resume: (callback: Callback) => void;

    // Clock manager management
    set_restart_clock: (restart: boolean, callback: Callback) => void;
    set_timings: (timings: ClockManagerTimings, callback: Callback) => void;
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

        socket.on("set_time", (time, callback) => {
            if (typeof callback !== "function")
                return;

            if (!isInt(time)) {
                callback({ success: false, message: "Invalid time" });
                return;
            }

            callback(createResult(() => clock.setTime(time)));
        });

        socket.on("add_time", (time, callback) => {
            if (typeof callback !== "function")
                return;

            if (!isInt(time)) {
                callback({ success: false, message: "Invalid time" });
                return;
            }

            callback(createResult(() => clock.addTime(time)));
        });

        socket.on("start", (time, callback) => {
            if (typeof callback !== "function")
                return;

            if (!isInt(time)) {
                callback({ success: false, message: "Invalid time" });
                return;
            }

            callback(createResult(() => clock.start(time)));
        });

        socket.on("suspend", (callback) => {
            if (typeof callback !== "function")
                return;

            callback(createResult(() => clock.suspend()));
        });

        socket.on("pause", (callback) => {
            if (typeof callback !== "function")
                return;

            callback(createResult(() => clock.pause()));
        });

        socket.on("resume", (callback) => {
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

        socket.on("set_restart_clock", (restart, callback) => {
            if (typeof callback !== "function")
                return;

            if (typeof restart !== "boolean") {
                callback({ success: false, message: "Invalid type" });
                return;
            }

            clockManager.restartAfterTurn = restart;
            callback({ success: true });
        });

        socket.on("set_timings", (timings, callback) => {
            if (typeof callback !== "function")
                return;

            if (!isObject(timings)) {
                callback({ success: false, message: "Invalid type" });
            } else if (!isInt(timings.timeForTurn)) {
                callback({ success: false, message: "Invalid turn duration" });
            } else if (!isInt(timings.timeForCardDraw)) {
                callback({ success: false, message: "Invalid card draw duration" });
            } else if (!isReal(timings.specialTurnMultiplier)) {
                callback({ success: false, message: "Invalid special turn multiplier" });
            } else {
                clockManager.timeForTurn = timings.timeForTurn;
                clockManager.timeForCardDraw = timings.timeForCardDraw;
                clockManager.specialTurnMultiplier = timings.specialTurnMultiplier;

                callback({ success: true });
            }
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
