import { Card } from "types/card";
import { CardDrawTurn, CardUsageTurn, Turn } from "types/turn";

export interface CardUsageTurnData {
  turn: CardUsageTurn;
  options: Card[];
}

export interface CardDrawTurnData {
  turn: CardDrawTurn;
  options: Card[];
  requiredSelections: number;
}

export interface PassiveTurnData {
  turn: Turn;
}

export type TurnData = CardUsageTurnData | CardDrawTurnData | PassiveTurnData;
