import { Namespace, Server } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { Game } from "src/game/game";
import { Player, Turn, CardUsageTurn, CardDrawTurn, CardType } from "src/game/types";
import { loginByCode } from "src/login";

interface CardInfo {
    image: string,
}

interface CardUsageTurnData {
    turn: CardUsageTurn,
    options: CardInfo[]
}

interface CardDrawTurnData {
    turn: CardDrawTurn,
    options: CardInfo[],
    requiredSelections: number
}

interface PassiveTurnData {
    turn: Turn
}

type TurnData = CardUsageTurnData | CardDrawTurnData | PassiveTurnData;

interface PlayerServerToClientEvents {
    player_info: (info: { id: string, name: string }) => void,
    turn_info: (info: TurnData) => void
}

interface PlayerClientToServerEvents { }

interface PlayerSocketData {
    player: string;
}

export function registerPlayerNamespace(server: Server, game: Game) {
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
        socket.emit("turn_info", serializeTurnInfo(playerObject));
    });

    game.on("turn_change", () => {
        for (var p of registry.listPlayers()) {
            var turnData = serializeTurnInfo(p);

            player.in(p.id).emit("turn_info", turnData);
        }
    });

    function getCardInfo(card: CardType): CardInfo {
        return {
            image: card.image
        }
    }

    function serializeTurnInfo(player: Player): TurnData {
        var turn = game.turn;

        switch (turn.phase) {
            case "card_draw":
                return {
                    turn: turn,
                    options: game.getCardChoice(player).map(c => getCardInfo(c)),
                    requiredSelections: game.getCardDrawCount(player)
                }
            case "card_usage":
                return {
                    turn: turn,
                    options: game.state.getPlayer(player)!.cards.map(c => getCardInfo(c))
                }
            default:
                return {
                    turn: turn
                }
        }
    }
}
