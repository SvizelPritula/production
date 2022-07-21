import { CardType } from "src/game/types";
import { product } from "src/game/math_utils";
import { getRound, pointChance, legendaryChance } from "src/game/data/chances";
import { AddPoints } from "src/game/data/effects";

const specialColor = "#111111";

export const pointCards: CardType[] = [
    {
        id: "30-points",
        name: "30 points",
        color: specialColor,
        image: "add-30",
        effect(context) {
            context.addEffect(new AddPoints(context.player, 30));
        },
        chance(state, player, registry) {
            return product(
                legendaryChance,
                pointChance(getRound(state.turn))
            );
        },
    },
    {
        id: "20-points",
        name: "20 points",
        color: specialColor,
        image: "add-20",
        effect(context) {
            context.addEffect(new AddPoints(context.player, 20));
        },
        chance(state, player, registry) {
            return product(
                legendaryChance,
                pointChance(getRound(state.turn))
            );
        },
    },
];
