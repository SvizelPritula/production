import { Resource } from "src/game/types";
import { linear_interpolation } from "../math_utils";
import { getRound } from "./chances";

export const coal: Resource = {
    id: "coal",
    name: "Coal",
    color: "#502d16",
    getPointsPerUnit(turn) { return 5; },
    getUnitsPerProducer(turn) {
        return linear_interpolation([
            [0, 3],
            [19, 3],
            [20, 2],
            [24, 2],
            [25, 1],
            [29, 1],
            [30, 0]
        ])(getRound(turn));
    },
};

export const gas: Resource = {
    id: "gas",
    name: "Gas",
    color: "#00ccff",
    getPointsPerUnit(turn) { return 3; },
    getUnitsPerProducer(turn) {
        return linear_interpolation([
            [0, 3],
            [24, 3],
            [25, 2],
            [32, 2],
            [33, 1]
        ])(getRound(turn));
    },
};

export const nuclear: Resource = {
    id: "nuclear",
    name: "Nuclear",
    color: "#668800",
    getPointsPerUnit(turn) { return 50; },
    getUnitsPerProducer(turn) { return 1; },
};

export const solar: Resource = {
    id: "solar",
    name: "Solar",
    color: "#ffcc00",
    volatile: true,
    getPointsPerUnit(turn) { return 12; },
    getUnitsPerProducer(turn) { return 1; },
};

export const water: Resource = {
    id: "water",
    name: "Water",
    color: "#0066ff",
    volatile: true,
    getPointsPerUnit(turn) { return 12; },
    getUnitsPerProducer(turn) { return 1; },
};

export const resources: Resource[] = [
    coal,
    gas,
    nuclear,
    solar,
    water
];
