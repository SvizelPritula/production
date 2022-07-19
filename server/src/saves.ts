import EventEmitter from "events";
import path from "path";
import fs from "fs/promises";
import { GameState, Turn, PlayerState, Registry, UserError, CardType } from "src/game/types";

interface SaveData {
    turn: Turn;
    players: {
        id: string;
        state: {
            points: number;
            cards: string[];
            lastUsedCard: string | null;
            resources: {
                id: string;
                amount: number;
                production: number;
                usage: number;
            }[];
        };
    }[];
}

export class SaveManager extends EventEmitter {
    private saveDirectory: string;

    constructor() {
        super();

        this.saveDirectory =
            process.env.SAVE_PATH ?? path.join(require.main!.path, "../saves");
    }

    async listSaves(): Promise<string[]> {
        var files = await fs.readdir(this.saveDirectory);

        var saveNames = files
            .map(file => path.parse(file))
            .filter(file => file.ext === ".json")
            .map(file => file.name);

        return saveNames;
    }

    private getTurnName(turn: Turn): string {
        switch (turn.phase) {
            case "before_game":
            case "after_game":
                return turn.phase;

            case "card_draw":
                return `${turn.round}-draw`;

            case "card_usage":
                return `${turn.round}-${turn.turn}`;
        }
    }

    async save(state: GameState, registry: Registry): Promise<void> {
        var data: SaveData = {
            turn: state.turn,
            players: Array.from(state.players.entries()).map(([player, state]) => ({
                id: player.id,
                state: {
                    points: state.points,
                    cards: state.cards.map(c => c.id),
                    lastUsedCard: state.lastUsedCard?.id ?? null,
                    resources: Array.from(state.resources.entries()).map(([resource, quantity]) => ({
                        id: resource.id,
                        amount: quantity.amount,
                        production: quantity.production,
                        usage: quantity.usage
                    }))
                }
            }))
        };

        var content = JSON.stringify(data, null, 4);

        var date = new Date();

        var day = `${date.getUTCFullYear().toString().padStart(4, '0')}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}-${date.getUTCDay().toString().padStart(2, '0')}`;
        var time = `${date.getUTCHours().toString().padStart(2, '0')}-${date.getUTCMinutes().toString().padStart(2, '0')}-${date.getUTCSeconds().toString().padStart(2, '0')}-${date.getUTCMilliseconds().toString().padStart(3, '0')}`
        var turn = this.getTurnName(state.turn);

        var name = `${day}-${time}-${turn}`;

        await fs.writeFile(path.join(this.saveDirectory, `${name}.json`), content, { encoding: "utf-8" });
        
        this.emit("save", name);
    }

    async load(name: string, registry: Registry): Promise<GameState> {
        var files = await fs.readdir(this.saveDirectory);

        var filename = files
            .map(file => path.parse(file))
            .filter(file => file.ext === ".json")
            .find(file => file.name === name)?.base ?? null;

        if (filename == null) {
            throw new UserError("Unknown save name");
        }

        var content = await fs.readFile(path.join(this.saveDirectory, filename), { encoding: "utf-8" });
        var data: SaveData = JSON.parse(content);

        var result = new GameState(registry);

        result.turn = data.turn;

        for (var { id, state } of data.players) {
            var playerState = result.getPlayer(id);

            if (playerState != null) {
                playerState.points = state.points;
                playerState.cards = state.cards.map(id => registry.getCard(id)).filter((c): c is CardType => c != null);
                playerState.lastUsedCard = state.lastUsedCard == null ? null : registry.getCard(state.lastUsedCard);

                for (var resource of state.resources) {
                    var resourceState = playerState.getResource(resource.id);

                    if (resourceState != null) {
                        resourceState.amount = resource.amount;
                        resourceState.production = resource.production;
                        resourceState.usage = resource.usage;
                    }
                }
            }
        }

        this.emit("load", name);
        return result;
    }
}

interface SaveEvents {
    'save': (name: string) => void;
    'load': (name: string) => void;
}

export declare interface SaveManager {
    on<U extends keyof SaveEvents>(
        event: U, listener: SaveEvents[U]
    ): this;

    emit<U extends keyof SaveEvents>(
        event: U, ...args: Parameters<SaveEvents[U]>
    ): boolean;
}
