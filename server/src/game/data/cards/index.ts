import { CardType } from "src/game/types/index";
import { coalCards } from "src/game/data/cards/coal";
import { pointCards } from "src/game/data/cards/points";
import { gasCards } from "src/game/data/cards/gas";
import { nuclearCards } from "src/game/data/cards/nuclear";
import { solarCards } from "src/game/data/cards/solar";
import { waterCards } from "src/game/data/cards/water";

export const cards: CardType[] = [
    ...coalCards,
    ...gasCards,
    ...nuclearCards,
    ...solarCards,
    ...waterCards,
    ...pointCards
];
