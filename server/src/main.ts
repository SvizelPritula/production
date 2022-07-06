import { App } from "uWebSockets.js";
import { Server } from "socket.io";

import { Game } from "src/game/game";
import { loginByCode, LoginResult } from "./login";

const game = new Game();
const registry = game.registry;

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

const root = io.of("/");

root.on("connection", (socket) => {
    console.log("Connection");

    socket.on("login", (code: string, callback: (result: LoginResult) => void) => {
        console.log("Login attempt");

        if (typeof code !== "string") {
            callback({ success: false, reason: "bad_payload" });
            return;
        }

        var result = loginByCode(code, registry);
        callback(result);
    });
});

io.attachApp(app);

app.listen(5000, () => console.log("WebSocket server is listening"));
