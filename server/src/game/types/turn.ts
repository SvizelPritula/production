import { rounds, turnsInRound } from "../constants";

export interface CardDrawTurn {
  round: number;
  phase: "card_draw";
}

export interface CardUsageTurn {
  round: number;
  phase: "card_usage";
  turn: number;
}

export interface BeforeGameTurn {
  phase: "before_game";
}

export interface AfterGameTurn {
  phase: "after_game";
}

export type Turn =
  | CardDrawTurn
  | CardUsageTurn
  | BeforeGameTurn
  | AfterGameTurn;

export function getFirstTurn(): Turn {
  return { phase: "before_game" };
}

export function getNextTurn(previous_turn: Turn): Turn {
  switch (previous_turn.phase) {
    case "before_game":
      return { round: 0, phase: "card_draw" };
    case "card_draw":
      return {
        phase: "card_usage",
        round: previous_turn.round,
        turn: 0,
      };
    case "card_usage":
      if (previous_turn.turn < turnsInRound - 1) {
        return {
          phase: "card_usage",
          round: previous_turn.round,
          turn: previous_turn.turn + 1,
        };
      } else {
        if (previous_turn.round < rounds - 1) {
          return {
            phase: "card_draw",
            round: previous_turn.round + 1,
          };
        } else {
          return { phase: "after_game" };
        }
      }
    case "after_game":
      return { phase: "after_game" };
  }
}

export function isLastTurnInRound(turn: Turn) {
  return turn.phase == "card_usage" && turn.turn == turnsInRound - 1;
}
