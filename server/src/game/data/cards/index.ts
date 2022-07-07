import { CardType, GameState, Registry } from "src/game/types/index";

export const cards: CardType[] = [
    {
        id: "wood-shipment",
        name: "Wood shipment",
        image: "a",
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
        image: "b",
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
        image: "c",
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
        image: "d",
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
