import { App } from "uWebSockets.js";
import { Server } from "socket.io";

import { Game } from "src/game/game";
import { registerRootNamespace } from "./namespaces/root";

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

io.attachApp(app);

app.listen(5000, () => console.log("WebSocket server is listening"));
