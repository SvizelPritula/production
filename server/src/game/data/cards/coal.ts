import { CardType } from "src/game/types";
import { coal } from "src/game/data/resources";
import { product } from "src/game/math_utils";
import { coalChance, commonChance, getRound, uncommonChance, rareChance, epicChance } from "src/game/data/chances";
import { AddProduction, AddUnits, AddUsage } from "src/game/data/effects";

export const coalCards: CardType[] = [
    {
        id: "small-coal-mine",
        name: "Small coal mine",
        color: coal.color,
        image: "small-coal-mine",
        effect(context) {
            context.addEffect(new AddProduction(context.player, coal, 1));
        },
        chance(state, player, registry) {
            return product(
                uncommonChance,
                coalChance(getRound(state.turn)),
                Number(getRound(state.turn) < 15)
            );
        },
    },
    {
        id: "large-coal-mine",
        name: "Large coal mine",
        color: coal.color,
        image: "large-coal-mine",
        effect(context) {
            context.addEffect(new AddProduction(context.player, coal, 2));
        },
        chance(state, player, registry) {
            return product(
                rareChance,
                coalChance(getRound(state.turn)),
                Number(getRound(state.turn) < 10)
            );
        },
    },
    {
        id: "small-coal-pile",
        name: "Small coal pile",
        color: coal.color,
        image: "small-pile",
        effect(context) {
            context.addEffect(new AddUnits(context.player, coal, 3));
        },
        chance(state, player, registry) {
            return product(
                commonChance,
                coalChance(getRound(state.turn))
            );
        },
    },
    {
        id: "medium-coal-pile",
        name: "Medium coal pile",
        color: coal.color,
        image: "medium-pile",
        effect(context) {
            context.addEffect(new AddUnits(context.player, coal, 6));
        },
        chance(state, player, registry) {
            return product(
                uncommonChance,
                coalChance(getRound(state.turn))
            );
        },
    },
    {
        id: "large-coal-pile",
        name: "Large coal pile",
        color: coal.color,
        image: "large-pile",
        effect(context) {
            context.addEffect(new AddUnits(context.player, coal, 10));
        },
        chance(state, player, registry) {
            return product(
                epicChance,
                coalChance(getRound(state.turn)),
                Number(getRound(state.turn) > 5),
            );
        },
    },
    {
        id: "coal-gift",
        name: "Coal gift",
        color: coal.color,
        image: "gift",
        effect(context) {
            for (var player of context.registry.listPlayers()) {
                context.addEffect(new AddUnits(player, coal, 6));
            }
        },
        chance(state, player, registry) {
            return product(
                rareChance,
                coalChance(getRound(state.turn)),
                Number(getRound(state.turn) > 5),
            );
        },
    },
    {
        id: "coal-plant",
        name: "Coal plant",
        color: coal.color,
        image: "plant",
        effect(context) {
            context.addEffect(new AddUsage(context.player, coal, 10));
        },
        chance(state, player, registry) {
            return product(
                rareChance,
                coalChance(getRound(state.turn)),
                Number(getRound(state.turn) > 0),
                getRound(state.turn) == 1 ? 5 : 1,
                Number(getRound(state.turn) < 20)
            );
        },
    }
];
