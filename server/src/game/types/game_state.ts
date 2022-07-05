import { Player, PlayerState, Registry } from "src/game/types";

export class GameState {
    readonly players: Map<Player, PlayerState>;
    private readonly registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;

        this.players = new Map();

        for (const player of this.registry.listPlayers()) {
            this.players.set(player, new PlayerState(this.registry));
        }
    }

    getPlayer(player: Player | string): PlayerState | null {
        var playerObject = this.registry.getPlayer(player);
        if (playerObject == null) return null;
        return this.players.get(playerObject) ?? null;
    }
}
