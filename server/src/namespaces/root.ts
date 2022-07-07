import { Namespace, Server } from "socket.io";
import { Game } from "src/game/game";
import { loginByCode, LoginResult } from "src/login";

interface RootServerToClientEvents {}

interface RootClientToServerEvents {
    login: (code: string, callback: (result: LoginResult) => void) => void;
}

export function registerRootNamespace(server: Server, game: Game) {
    const registry = game.registry;

    const root: Namespace<RootClientToServerEvents, RootServerToClientEvents, {}, {}> = server.of("/");

    root.on("connection", (socket) => {
        socket.on("login", (code, callback) => {
            if (typeof code !== "string" || typeof callback !== "function") {
                callback({ success: false, reason: "bad_payload" });
                return;
            }

            var result = loginByCode(code, registry);
            callback(result);
        });
    });
}
