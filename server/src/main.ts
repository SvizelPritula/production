import { Server } from "socket.io";

import { Game } from "src/game/game";
import { registerAuthNamespace } from "./namespaces/auth";
import { registerAdminNamespace } from "./namespaces/admin";
import { registerPlayerNamespace } from "./namespaces/player";
import { loadAssets } from "./assets";
import { registerBoardNamespace } from "./namespaces/board";
import { Clock } from "./clock";
import { ClockManager } from "./clock_manager";
import { registerClockNamespace } from "./namespaces/clock";
import { SaveManager } from "./saves";

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
    const saves = new SaveManager();

    const clock = new Clock();
    const clockManager = new ClockManager();

    registerAuthNamespace(io, game);
    registerAdminNamespace(io, game, clock, clockManager, saves);
    registerPlayerNamespace(io, game, assets);
    registerBoardNamespace(io, game, assets);
    registerClockNamespace(io, clock);

    clock.on("alarm", () => {
        game.evaluateTurn();
    })

    game.on("turn", ({ turn }) => {
        var newTime = clockManager.getTurnDuration(turn);

        if (newTime != null)
            clock.start(newTime);
    });

    game.on("turn", (state) => {
        saves.save(state, game.registry);
    });

    var port = 5000;

    if (process.env.PORT != null) {
        var parsedPort = parseInt(process.env.PORT);
        if (!isNaN(parsedPort)) {
            port = parsedPort;
        }
    }

    io.listen(port);
})();
