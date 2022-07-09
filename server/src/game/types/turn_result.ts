import { GameState, Player, Turn, Registry } from "src/game/types";

export type GameStateChangeCallback = (state: GameState, registry: Registry) => void;

export interface GameStateChangeEffect {
    apply: GameStateChangeCallback;
}

export class CardEffectContext {
    state: GameState;
    player: Player;
    private result: TurnResult;

    constructor(state: GameState, player: Player, result: TurnResult) {
        this.state = state;
        this.player = player;
        this.result = result;
    }

    addEffect(effect: GameStateChangeEffect | GameStateChangeCallback) {
        if (typeof effect !== "object") {
            this.result.addEffect({ apply: effect });
        } else {
            this.result.addEffect(effect);
        }
    }
}

export class TurnResult {
    registry: Registry;
    target: GameState;

    scheduledChanges: GameStateChangeEffect[] = [];

    constructor(target: GameState, registry: Registry) {
        this.registry = registry;
        this.target = target;
    }

    apply() {
        for (const change of this.scheduledChanges) {
            change.apply(this.target, this.registry);
        }
    }

    addEffect(effect: GameStateChangeEffect) {
        this.scheduledChanges.push(effect);
    }

    createContext(player: Player): CardEffectContext {
        return new CardEffectContext(this.target, player, this);
    }
}
