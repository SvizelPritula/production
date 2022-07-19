import { CardType } from "src/game/types";
import { coal, gas, nuclear, solar, water } from "src/game/data/resources";
import { product } from "src/game/math_utils";
import { gasChance, commonChance, getRound, uncommonChance, rareChance, epicChance, nuclearChance, solarChance, waterChance } from "src/game/data/chances";
import { AddPoints, AddProduction, AddUnits, AddUsage } from "src/game/data/effects";

export const waterCards: CardType[] = [
    {
        id: "more-rain",
        name: "Rainy forecast",
        color: water.color,
        image: "rain",
        effect(context) {
            for (var player of context.registry.listPlayers()) {
                context.addEffect(new AddProduction(player, water, 1));
            }
        },
        chance(state, player, registry) {
            return product(
                uncommonChance,
                waterChance(getRound(state.turn))
            );
        },
    },
    {
        id: "less-rain",
        name: "Dry forecast",
        color: water.color,
        image: "dry",
        effect(context) {
            for (var player of context.registry.listPlayers()) {
                context.addEffect(new AddProduction(player, water, -1));
            }
        },
        chance(state, player, registry) {
            return product(
                rareChance,
                waterChance(getRound(state.turn))
            );
        },
    },
    {
        id: "water-plant",
        name: "Hydroelectric power plant",
        color: water.color,
        image: "water-plant",
        effect(context) {
            context.addEffect(new AddUsage(context.player, water, 1));
        },
        chance(state, player, registry) {
            return product(
                commonChance,
                waterChance(getRound(state.turn))
            );
        },
    },
];
