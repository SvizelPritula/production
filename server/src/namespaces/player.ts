import { Namespace, Server } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { Game } from "src/game/game";
import { Player, Turn, CardUsageTurn, CardDrawTurn, CardType, UserError } from "src/game/types";
import { loginByCode } from "src/login";
import { AssetStore } from "src/assets";
import { serializeTurnOptions, TurnOptions } from "src/network_types";

type TurnSaveError = null | "bad_turn" | "turn_mismatch" | "bad_payload" | "invalid_selection";

interface PlayerServerToClientEvents {
    player_info: (info: { id: string, name: string }) => void,
    turn_info: (info: TurnOptions) => void;
    drawn_cards: (selection: number[]) => void;
    used_card: (selection: number | null) => void;
}

interface PlayerClientToServerEvents {
    save_drawn_cards: (turn: Turn, selection: number[], callback: (error: TurnSaveError) => void) => void;
    save_used_card: (turn: Turn, selection: number | null, callback: (error: TurnSaveError) => void) => void;
}

interface PlayerSocketData {
    player: string;
}

export function registerPlayerNamespace(server: Server, game: Game, assets: AssetStore) {
    const registry = game.registry;

    const player: Namespace<PlayerClientToServerEvents, PlayerServerToClientEvents, {}, PlayerSocketData> = server.of("/player");

    player.use((socket, next) => {
        var code = socket.handshake.auth?.code;

        if (typeof code === "string") {
            var result = loginByCode(code, registry);

            if (result.success && result.kind === "player") {
                socket.join(result.player);
                socket.data.player = result.player;

                next();
                return;
            }
        }

        var error: ExtendedError = new Error("Invalid code");
        error.data = { reason: "bad_code" };
        next(error);
    });

    player.on("connection", socket => {
        var playerObject = registry.getPlayer(socket.data.player!)!;

        socket.emit("player_info", { id: playerObject.id, name: playerObject.name });
        socket.emit("turn_info", serializeTurnOptions(playerObject, game, assets));

        switch (game.state.turn.phase) {
            case "card_draw":
                socket.emit("drawn_cards", game.drawSelection.get(playerObject) ?? []);
                break;

            case "card_usage":
                socket.emit("used_card", game.playSelection.get(playerObject)!);
                break;
        }

        socket.on("save_drawn_cards", (turn, selection, callback) => {
            var realTurn = game.state.turn;

            if (typeof turn !== "object" || turn == null) {
                callback("bad_payload");
                return;
            }

            if (realTurn.phase !== "card_draw") {
                callback("bad_turn");
                return;
            }

            if (turn.phase !== "card_draw" || turn.round !== realTurn.round) {
                callback("turn_mismatch");
                return;
            }

            if (!Array.isArray(selection) || !selection.every(n => typeof n == "number")) {
                callback("bad_payload");
                return;
            }

            try {
                game.selectCardsToDraw(playerObject, selection);
                callback(null);
            } catch (error) {
                if (error instanceof UserError) {
                    callback("invalid_selection");
                } else {
                    throw error;
                }
            }
        });

        socket.on("save_used_card", (turn, selection, callback) => {
            var realTurn = game.state.turn;

            if (typeof turn !== "object" || turn == null) {
                callback("bad_payload");
                return;
            }

            if (realTurn.phase !== "card_usage") {
                callback("bad_turn");
                return;
            }

            if (turn.phase !== "card_usage" || turn.round !== realTurn.round || turn.turn !== realTurn.turn) {
                callback("turn_mismatch");
                return;
            }

            if (typeof selection !== "number" && selection !== null) {
                callback("bad_payload");
                return;
            }

            try {
                game.selectCardToPlay(playerObject, selection);
                callback(null);
            } catch (error) {
                if (error instanceof UserError) {
                    callback("invalid_selection");
                } else {
                    throw error;
                }
            }
        });
    });

    game.on("turn_change", () => {
        for (var p of registry.listPlayers()) {
            var turnData = serializeTurnOptions(p, game, assets);

            player.in(p.id).emit("turn_info", turnData);
        }
    });

    game.on("draw_selection", (p) => {
        player.in(p.id).emit("drawn_cards", game.drawSelection.get(p) ?? []);
    });

    game.on("play_selection", (p) => {
        player.in(p.id).emit("used_card", game.playSelection.get(p)!);
    });
}
