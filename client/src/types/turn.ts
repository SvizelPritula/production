export interface CardDrawTurn {
    round: number;
    phase: "card_draw";
}

export interface CardUsageTurn {
    round: number;
    phase: "card_usage";
    turn: number;
}

export type Turn = CardDrawTurn | CardUsageTurn;
