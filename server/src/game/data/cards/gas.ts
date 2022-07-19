import { CardType } from "src/game/types";
import { coal, gas } from "src/game/data/resources";
import { product } from "src/game/math_utils";
import { gasChance, commonChance, getRound, uncommonChance, rareChance, epicChance } from "src/game/data/chances";
import { AddPoints, AddProduction, AddUnits, AddUsage } from "src/game/data/effects";

export const gasCards: CardType[] = [
    {
        id: "gas-pipeline",
        name: "Gas pipeline",
        color: gas.color,
        image: "pipeline",
        effect(context) {
            context.addEffect(new AddProduction(context.player, gas, 1));
        },
        chance(state, player, registry) {
            return product(
                rareChance,
                gasChance(getRound(state.turn))
            );
        },
    },
    {
        id: "small-oil-deposit",
        name: "Small oil deposit",
        color: gas.color,
        image: "small-oil-deposit",
        effect(context) {
            context.addEffect(new AddUnits(context.player, gas, 3));
            context.addEffect(new AddPoints(context.player, 6));
        },
        chance(state, player, registry) {
            return product(
                commonChance,
                gasChance(getRound(state.turn))
            );
        },
    },
    {
        id: "medium-oil-deposit",
        name: "Medium oil deposit",
        color: gas.color,
        image: "medium-oil-deposit",
        effect(context) {
            context.addEffect(new AddUnits(context.player, gas, 5));
            context.addEffect(new AddPoints(context.player, 10));
        },
        chance(state, player, registry) {
            return product(
                uncommonChance,
                gasChance(getRound(state.turn))
            );
        },
    },
    {
        id: "large-oil-deposit",
        name: "Large oil deposit",
        color: gas.color,
        image: "large-oil-deposit",
        effect(context) {
            context.addEffect(new AddUnits(context.player, gas, 7));
            context.addEffect(new AddPoints(context.player, 14));
        },
        chance(state, player, registry) {
            return product(
                epicChance,
                gasChance(getRound(state.turn))
            );
        },
    },
    {
        id: "gas-plant",
        name: "Gas plant",
        color: gas.color,
        image: "plant",
        effect(context) {
            context.addEffect(new AddUsage(context.player, gas, 10));
        },
        chance(state, player, registry) {
            return product(
                rareChance,
                gasChance(getRound(state.turn))
            );
        },
    },
    {
        id: "gas-surplus",
        name: "Gas surplus",
        color: gas.color,
        image: "pipe-surplus",
        effect(context) {
            for (var player of context.registry.listPlayers()) {
                var production = context.state.getPlayer(player)!.getResource(gas)!.production;

                context.addEffect(new AddUnits(player, gas, production * gas.getUnitsPerProducer(context.state.turn)));
            }
        },
        chance(state, player, registry) {
            return product(
                rareChance,
                gasChance(getRound(state.turn))
            );
        },
    },
    {
        id: "gas-leak",
        name: "Gas leak",
        color: gas.color,
        image: "gas-leak",
        effect(context) {
            for (var player of context.registry.listPlayers()) {
                if (player != context.player) {
                    context.addEffect(new AddUnits(player, gas, -10));
                }
            }
        },
        chance(state, player, registry) {
            return product(
                rareChance,
                gasChance(getRound(state.turn))
            );
        },
    },
    {
        id: "coal-to-gas-upgrade",
        name: "Coal to gas plant upgrade",
        color: gas.color,
        image: "coal-to-gas-upgrade",
        effect(context) {
            var amount = context.state.getPlayer(context.player)!.getResource(coal)!.usage;
            amount = Math.min(amount, 20);

            context.addEffect(new AddUsage(context.player, coal, -amount));
            context.addEffect(new AddUsage(context.player, gas, amount));
        },
        chance(state, player, registry) {
            return product(
                rareChance,
                gasChance(getRound(state.turn)),
                Number(getRound(state.turn) > 15)
            );
        },
    }
];
