import { Server } from "socket.io";

import { Game } from "src/game/game";
import { registerRootNamespace } from "./namespaces/root";
import { registerAdminNamespace } from "./namespaces/admin";
import { registerPlayerNamespace } from "./namespaces/player";
import { loadAssets } from "./assets";
import { registerBoardNamespace } from "./namespaces/board";

(async () => {
    const game = new Game();

    const io = new Server({
        path: "/game",
        pingInterval: 10000,
        pingTimeout: 10000,
        serveClient: false,
        cors: {
            origin: "*"
        }
    });

    const assets = await loadAssets();

    registerRootNamespace(io, game);
    registerAdminNamespace(io, game);
    registerPlayerNamespace(io, game, assets);
    registerBoardNamespace(io, game, assets);

    io.listen(5000);
})();
