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
