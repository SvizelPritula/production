import { Namespace, Server } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { Game } from "src/game/game";
import { loginByCode } from "src/login";
import { AssetStore } from "src/assets";
import { PublicGameState, serializePublicGameState } from "src/network_types";


interface BoardServerToClientEvents {
    "state": (state: PublicGameState) => void
}

interface BoardClientToServerEvents { }

export function registerBoardNamespace(server: Server, game: Game, assets: AssetStore) {
    const registry = game.registry;

    const board: Namespace<BoardClientToServerEvents, BoardServerToClientEvents, {}, {}> = server.of("/board");

    board.use((socket, next) => {
        var code = socket.handshake.auth?.code;

        if (typeof code === "string") {
            var result = loginByCode(code, registry);

            if (result.success && result.kind === "board") {
                next();
                return;
            }
        }

        var error: ExtendedError = new Error("Invalid code");
        error.data = { reason: "bad_code" };
        next(error);
    });

    board.on("connection", socket => {
        socket.emit("state", serializePublicGameState(game, assets));
    });

    game.on("turn_change", () => {
        board.emit("state", serializePublicGameState(game, assets));
    });
}
