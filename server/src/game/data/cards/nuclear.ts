import { CardType } from "src/game/types";
import { coal, gas, nuclear } from "src/game/data/resources";
import { product } from "src/game/math_utils";
import { gasChance, commonChance, getRound, uncommonChance, rareChance, epicChance, nuclearChance } from "src/game/data/chances";
import { AddPoints, AddProduction, AddUnits, AddUsage } from "src/game/data/effects";

export const nuclearCards: CardType[] = [
    {
        id: "uranium",
        name: "Uranium",
        color: nuclear.color,
        image: "uranium",
        effect(context) {
            context.addEffect(new AddUnits(context.player, nuclear, 1));
        },
        chance(state, player, registry) {
            return product(
                commonChance,
                nuclearChance(getRound(state.turn))
            );
        },
    },
    {
        id: "reactor",
        name: "Nuclear reactor",
        color: nuclear.color,
        image: "reactor",
        effect(context) {
            context.addEffect(new AddUsage(context.player, nuclear, 1));
        },
        chance(state, player, registry) {
            return product(
                rareChance,
                nuclearChance(getRound(state.turn))
            );
        },
    },
];
