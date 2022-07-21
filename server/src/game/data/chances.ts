import { linear_interpolation } from "src/game/math_utils";
import { Turn } from "src/game/types";

// Coal era: 0-9
// Gas era: 10-19
// Nuclear era: 20-29
// Renewable era: 30-39

export const coalChance = linear_interpolation([
    [0, 10],
    [9, 10],
    [10, 0],
    [11, 8],
    [15, 8],
    [25, 5],
    [30, 0]
]);

export const gasChance = linear_interpolation([
    [9, 0],
    [10, 10],
    [30, 10],
    [35, 5]
]);

export const nuclearChance = linear_interpolation([
    [19, 0],
    [20, 20],
    [21, 10]
]);

export const solarChance = linear_interpolation([
    [19, 0],
    [20, 2],
    [30, 12]
]);

export const waterChance = linear_interpolation([
    [24, 0],
    [25, 2],
    [30, 12]
]);

export const pointChance = (round: number) => 10;

export const commonChance = 20;
export const uncommonChance = 12;
export const rareChance = 6;
export const epicChance = 2;
export const legendaryChance = 2;

export function getRound(turn: Turn) {
    if (turn.phase === "card_draw" || turn.phase === "card_usage") {
        return turn.round;
    }

    return 0;
}
