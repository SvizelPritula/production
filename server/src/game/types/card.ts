import { CardEffectContext } from "src/game/types/turn_result";

export interface CardType {
    readonly id: string;
    readonly name: string;
    readonly description: string;

    readonly effect: (context: CardEffectContext) => void;
}
