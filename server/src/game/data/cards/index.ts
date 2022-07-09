import { CardType, GameState, Registry } from "src/game/types/index";

export const cards: CardType[] = [
    {
        id: "wood-shipment",
        name: "Wood shipment",
        image: "a",
        color: "#502d16",
        effect(context) {
            context.addEffect({
                apply(state: GameState, registry: Registry) {
                    state.getPlayer(context.player)!.getResource("wood")!.amount += 5;
                },
            })
        },
        chance(state, player, registry) {
            return 3;
        },
    },
    {
        id: "forest",
        name: "Forest",
        image: "b",
        color: "#502d16",
        effect(context) {
            context.addEffect({
                apply(state: GameState, registry: Registry) {
                    state.getPlayer(context.player)!.getResource("wood")!.production += 2;
                },
            })
        },
        chance(state, player, registry) {
            return 3;
        },
    },
    {
        id: "fireplace",
        name: "Fireplace",
        image: "c",
        color: "#502d16",
        effect(context) {
            context.addEffect({
                apply(state: GameState, registry: Registry) {
                    state.getPlayer(context.player)!.getResource("wood")!.usage += 1;
                },
            })
        },
        chance(state, player, registry) {
            return 3;
        },
    },
    {
        id: "wood-boilder",
        name: "Wood boiler",
        image: "d",
        color: "#502d16",
        effect(context) {
            context.addEffect({
                apply(state: GameState, registry: Registry) {
                    state.getPlayer(context.player)!.getResource("wood")!.usage += 5;
                },
            })
        },
        chance(state, player, registry) {
            return 3;
        },
    },
    {
        id: "stone-shipment",
        name: "stone shipment",
        image: "a",
        color: "#222222",
        effect(context) {
            context.addEffect({
                apply(state: GameState, registry: Registry) {
                    state.getPlayer(context.player)!.getResource("stone")!.amount += 5;
                },
            })
        },
        chance(state, player, registry) {
            return 3;
        },
    },
    {
        id: "mine",
        name: "Mine",
        image: "b",
        color: "#222222",
        effect(context) {
            context.addEffect({
                apply(state: GameState, registry: Registry) {
                    state.getPlayer(context.player)!.getResource("stone")!.production += 3;
                },
            })
        },
        chance(state, player, registry) {
            return 3;
        },
    },
    {
        id: "stone-processor",
        name: "Stone processor",
        image: "d",
        color: "#222222",
        effect(context) {
            context.addEffect({
                apply(state: GameState, registry: Registry) {
                    state.getPlayer(context.player)!.getResource("stone")!.usage += 5;
                },
            })
        },
        chance(state, player, registry) {
            return 3;
        },
    }
];
