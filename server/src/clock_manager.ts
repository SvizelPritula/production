import { Turn } from "src/game/types";

export class ClockManager {
    restartAfterTurn: boolean = true;
    timeForTurn: number = 5 * 1000;
    timeForCardDraw: number = 10 * 1000;

    getTurnDuration(turn: Turn): number | null {
        if (!this.restartAfterTurn) return null;
        if (turn.phase === "card_draw") return this.timeForCardDraw;
        return this.timeForTurn;
    }
}
