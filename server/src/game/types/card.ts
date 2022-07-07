import { CardEffectContext, GameState, Registry, Player, Turn } from "src/game/types";

export interface CardType {
    readonly id: string;
    readonly name: string;
    readonly image: string;

    readonly effect: (context: CardEffectContext) => void;
    readonly chance: (state: GameState, turn: Turn, player: Player, registry: Registry) => number;
}
