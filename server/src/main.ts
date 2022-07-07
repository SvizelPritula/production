import { App } from "uWebSockets.js";
import { Server } from "socket.io";

import { Game } from "src/game/game";
import { registerRootNamespace } from "./namespaces/root";
import { registerAdminNamespace } from "./namespaces/admin";

const game = new Game();

const app = App();
const io = new Server({
    path: "/game",
    pingInterval: 10000,
    pingTimeout: 10000,
    serveClient: false,
    cors: {
        origin: "*"
    }
});

registerRootNamespace(io, game);
registerAdminNamespace(io, game);

game.on("turn_change", () => {
    console.log(game.state);
});

io.attachApp(app);

app.listen(5000, () => console.log("WebSocket server is listening"));
