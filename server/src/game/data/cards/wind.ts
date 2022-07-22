import { CardType } from "src/game/types";
import { wind } from "src/game/data/resources";
import { product } from "src/game/math_utils";
import { commonChance, getRound, uncommonChance, rareChance, windChance } from "src/game/data/chances";
import { AddProduction, AddUsage } from "src/game/data/effects";

export const windCards: CardType[] = [
    {
        id: "more-wind",
        name: "Windy forecast",
        color: wind.color,
        image: "windy",
        effect(context) {
            for (var player of context.registry.listPlayers()) {
                context.addEffect(new AddProduction(player, wind, 1));
            }
        },
        chance(state, player, registry) {
            return product(
                uncommonChance,
                windChance(getRound(state.turn))
            );
        },
    },
    {
        id: "less-wind",
        name: "Still forecast",
        color: wind.color,
        image: "still",
        effect(context) {
            for (var player of context.registry.listPlayers()) {
                context.addEffect(new AddProduction(player, wind, -1));
            }
        },
        chance(state, player, registry) {
            return product(
                rareChance,
                windChance(getRound(state.turn))
            );
        },
    },
    {
        id: "wind-plant",
        name: "Windmill",
        color: wind.color,
        image: "windmill",
        effect(context) {
            context.addEffect(new AddUsage(context.player, wind, 1));
        },
        chance(state, player, registry) {
            return product(
                commonChance,
                windChance(getRound(state.turn))
            );
        },
    },
];
