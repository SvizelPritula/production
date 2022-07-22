import { CardType } from "src/game/types/index";
import { coalCards } from "src/game/data/cards/coal";
import { pointCards } from "src/game/data/cards/points";
import { gasCards } from "src/game/data/cards/gas";
import { nuclearCards } from "src/game/data/cards/nuclear";
import { solarCards } from "src/game/data/cards/solar";
import { windCards } from "src/game/data/cards/wind";

export const cards: CardType[] = [
    ...coalCards,
    ...gasCards,
    ...nuclearCards,
    ...solarCards,
    ...windCards,
    ...pointCards
];
