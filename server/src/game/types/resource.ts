import { Turn } from "src/game/types/turn";

export interface Resource {
    readonly id: string;
    readonly name: string;
    readonly color: string;

    readonly volatile?: boolean;

    getPointsPerUnit(turn: Turn): number;
    getUnitsPerProducer(turn: Turn): number;
}
