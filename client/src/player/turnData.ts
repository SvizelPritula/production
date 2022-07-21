import { Card } from "types/card";
import { AfterGameTurn, BeforeGameTurn, CardDrawTurn, CardUsageTurn, Turn } from "types/turn";

export interface CardUsageTurnData {
  turn: CardUsageTurn;
  options: Card[];
}

export interface CardDrawTurnData {
  turn: CardDrawTurn;
  options: Card[];
  requiredSelections: number;
}

export interface BeforeGameTurnData {
  turn: BeforeGameTurn;
}

export interface AfterGameTurnData {
  turn: AfterGameTurn;
  points: number;
}

export type TurnData = CardUsageTurnData | CardDrawTurnData | BeforeGameTurnData | AfterGameTurnData;
