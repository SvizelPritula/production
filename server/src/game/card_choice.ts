import { CardType, GameState, Player, Registry, Turn } from "src/game/types";
import { cardChoiceSize } from "./constants";
import { LCG } from "./lcg";

export function calculateCardChoice(
  state: GameState,
  player: Player,
  registry: Registry
): CardType[] {
  var seedBase = 0;

  if (state.turn.phase === "card_draw" || state.turn.phase === "card_usage") {
    seedBase = state.turn.round;
  }

  var random = new LCG((seedBase + player.cardSeed) << 8);

  var weightedArray = registry
    .listCards()
    .map((card): [CardType, number] => [
      card,
      card.chance(state, player, registry),
    ])
    .filter(([card, weight]) => weight > 0);
  var selectedCards = [];

  while (selectedCards.length < cardChoiceSize) {
    if (weightedArray.length > 0) {
      var selectedCard = random.nextWeightedChoice(weightedArray);
      selectedCards.push(selectedCard);
    } else {
      selectedCards.push(random.nextChoice(registry.listCards()));
    }
  }

  return selectedCards;
}
