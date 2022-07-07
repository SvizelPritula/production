import { Namespace, Server } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { Game } from "src/game/game";
import { loginByCode, LoginResult } from "src/login";

interface AdminServerToClientEvents { }

interface AdminClientToServerEvents {
    advance_turn: (callback: () => void) => void;
}

export function registerAdminNamespace(server: Server, game: Game) {
    const registry = game.registry;

    const admin: Namespace<AdminClientToServerEvents, AdminServerToClientEvents, {}, {}> = server.of("/admin");

    admin.use((socket, next) => {
        var code = socket.handshake.auth?.code;
        console.log(socket.handshake.auth);

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

    admin.on("connection", (socket) => {
        socket.on("advance_turn", (callback) => {
            game.evaluateTurn();
            callback();
        });
    });
}
