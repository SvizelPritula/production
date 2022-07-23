import { Turn } from "src/game/types";
import { specialRounds } from "./game/constants";

export class ClockManager {
  restartAfterTurn: boolean = true;
  timeForTurn: number = 15 * 1000;
  timeForCardDraw: number = 30 * 1000;
  specialTurnMultiplier: number = 2;

  private getMultiplier(round: number): number {
    if (specialRounds.includes(round)) return this.specialTurnMultiplier;

    return 1;
  }

  getTurnDuration(turn: Turn): number | null {
    if (!this.restartAfterTurn) return null;

    if (turn.phase === "card_draw")
      return Math.floor(this.timeForCardDraw * this.getMultiplier(turn.round));

    if (turn.phase === "card_usage")
      return Math.floor(this.timeForTurn * this.getMultiplier(turn.round));

    return null;
  }
}
