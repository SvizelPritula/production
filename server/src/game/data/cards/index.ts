import { CardType, GameState, Registry } from "src/game/types/index";

export const cards: CardType[] = [
    {
        id: "wood-shipment",
        name: "Wood shipment",
        description: "Add 5 wood",
        effect(context) {
            context.addEffect({
                apply(state: GameState, registry: Registry) {
                    state.getPlayer(context.player)!.getResource("wood")!.amount += 5;
                },
            })
        },
        chance(state, turn, player, registry) {
            return 1;
        },
    },
    {
        id: "forest",
        name: "Forest",
        description: "Add 2 wood production",
        effect(context) {
            context.addEffect({
                apply(state: GameState, registry: Registry) {
                    state.getPlayer(context.player)!.getResource("wood")!.production += 2;
                },
            })
        },
        chance(state, turn, player, registry) {
            return 1;
        },
    },
    {
        id: "fireplace",
        name: "Fireplace",
        description: "Add 1 wood generator",
        effect(context) {
            context.addEffect({
                apply(state: GameState, registry: Registry) {
                    state.getPlayer(context.player)!.getResource("wood")!.usage += 1;
                },
            })
        },
        chance(state, turn, player, registry) {
            return 1;
        },
    },
    {
        id: "wood-boilder",
        name: "Wood boiler",
        description: "Add 5 wood generators",
        effect(context) {
            context.addEffect({
                apply(state: GameState, registry: Registry) {
                    state.getPlayer(context.player)!.getResource("wood")!.usage += 5;
                },
            })
        },
        chance(state, turn, player, registry) {
            return 1;
        },
    }
];
