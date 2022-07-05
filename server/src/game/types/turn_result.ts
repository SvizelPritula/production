import { GameState, Player, Turn, Registry } from "src/game/types";

export type GameStateChangeCallback = (state: GameState, registry: Registry) => void;

export interface GameStateChangeEffect {
    apply: GameStateChangeCallback;
}

export class CardEffectContext {
    state: GameState;
    player: Player;
    turn: Turn;
    private result: TurnResult;

    constructor(state: GameState, player: Player, turn: Turn, result: TurnResult) {
        this.state = state;
        this.player = player;
        this.turn = turn;
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
    turn: Turn;

    scheduledChanges: GameStateChangeEffect[] = [];

    constructor(target: GameState, turn: Turn, registry: Registry) {
        this.registry = registry;
        this.target = target;
        this.turn = turn;
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
        return new CardEffectContext(this.target, player, this.turn, this);
    }
}
