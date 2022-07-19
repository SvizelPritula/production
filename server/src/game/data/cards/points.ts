import { CardType } from "src/game/types";
import { coal } from "src/game/data/resources";
import { product } from "src/game/math_utils";
import { coalChance, commonChance, getRound, uncommonChance, rareChance, epicChance, pointChance } from "src/game/data/chances";
import { AddPoints, AddProduction, AddUnits, AddUsage } from "src/game/data/effects";

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
                epicChance,
                pointChance(getRound(state.turn))
            );
        },
    },
];
