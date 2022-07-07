import { CardType, GameState, Player, Registry, Turn } from "src/game/types"
import { cardChoiceSize } from "./constants";
import { LCG } from "./lcg";

export function calculateCardChoice(state: GameState, turn: Turn, player: Player, registry: Registry): CardType[] {
    var random = new LCG(turn.round + player.cardSeed << 8);

    var weightedArray = registry.listCards()
        .map((card): [CardType, number] => [card, card.chance(state, turn, player, registry)])
        .filter(([card, weight]) => weight > 0);
    var selectedCards = [];

    while (selectedCards.length < cardChoiceSize) {
        if (weightedArray.length > 0) {
            var selectedCard = random.nextWeightedChoice(weightedArray);
            weightedArray = weightedArray.filter(e => e[0] != selectedCard);
            selectedCards.push(selectedCard);
        } else {
            selectedCards.push(random.nextChoice(registry.listCards()));
        }
    }

    return selectedCards;
}
