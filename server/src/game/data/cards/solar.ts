import { CardType } from "src/game/types";
import { coal, gas, nuclear, solar } from "src/game/data/resources";
import { product } from "src/game/math_utils";
import { gasChance, commonChance, getRound, uncommonChance, rareChance, epicChance, nuclearChance, solarChance } from "src/game/data/chances";
import { AddPoints, AddProduction, AddUnits, AddUsage } from "src/game/data/effects";

export const solarCards: CardType[] = [
    {
        id: "more-sun",
        name: "Sunny forecast",
        color: solar.color,
        image: "sunny",
        effect(context) {
            for (var player of context.registry.listPlayers()) {
                context.addEffect(new AddProduction(player, solar, 1));
            }
        },
        chance(state, player, registry) {
            return product(
                uncommonChance,
                solarChance(getRound(state.turn))
            );
        },
    },
    {
        id: "less-sun",
        name: "Cloudy forecast",
        color: solar.color,
        image: "cloudy",
        effect(context) {
            for (var player of context.registry.listPlayers()) {
                context.addEffect(new AddProduction(player, solar, -1));
            }
        },
        chance(state, player, registry) {
            return product(
                rareChance,
                solarChance(getRound(state.turn))
            );
        },
    },
    {
        id: "solar-plant",
        name: "Photovoltaic power plant",
        color: solar.color,
        image: "solar-plant",
        effect(context) {
            context.addEffect(new AddUsage(context.player, solar, 1));
        },
        chance(state, player, registry) {
            return product(
                commonChance,
                solarChance(getRound(state.turn))
            );
        },
    },
];
