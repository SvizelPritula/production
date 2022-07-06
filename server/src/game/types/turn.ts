import { turnsInRound } from "../constants";

interface CardDrawTurn {
    round: number;
    phase: "card_draw";
}

interface CardUsageTurn {
    round: number;
    phase: "card_usage";
    turn: number;
}

export type Turn = CardDrawTurn | CardUsageTurn;

export function getFirstTurn(): Turn {
    return { round: 0, phase: "card_draw" };
}

export function getNextTurn(previous_turn: Turn): Turn {
    switch (previous_turn.phase) {
        case "card_draw":
            return {
                phase: "card_usage",
                round: previous_turn.round,
                turn: 0
            }
        case "card_usage":
            if (previous_turn.turn < turnsInRound - 1) {
                return {
                    phase: "card_usage",
                    round: previous_turn.round,
                    turn: previous_turn.turn + 1
                };
            } else {
                return {
                    phase: "card_draw",
                    round: previous_turn.round + 1
                }
            }
    }
}

export function isLastTurnInRound(turn: Turn) {
    return turn.phase == "card_usage" && turn.turn == turnsInRound - 1;
}
