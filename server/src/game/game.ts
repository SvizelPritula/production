import { registry } from "src/game/registry";
import { applyPassiveEffects } from "src/game/passive_effects";
import { GameState, Player, Turn, Registry, getFirstTurn, UserError, TurnResult, CardType, getNextTurn, isLastTurnInRound } from "src/game/types";
import { calculateCardChoice } from "./card_choice";
import { cardsInHand } from "./constants";

export class Game {
    readonly registry: Registry;
    readonly state: GameState;
    turn: Turn;

    playSelection: Map<Player, number | null>;
    drawSelection: Map<Player, number[] | null>;

    constructor() {
        this.registry = registry;

        this.turn = getFirstTurn();
        this.state = new GameState(this.registry);

        this.playSelection = this.createEmptySelection();
        this.drawSelection = this.createEmptySelection();
    }

    private createEmptySelection(): Map<Player, null> {
        var map = new Map();

        for (const player of this.registry.listPlayers()) {
            map.set(player, null);
        }

        return map;
    }

    selectCardToPlay(player: Player | string, selection: number | null) {
        if (this.turn.phase !== "card_usage")
            throw new UserError("Cannot play cards in this turn phase");

        var playerObject = this.registry.getPlayer(player);
        if (playerObject == null) throw new UserError("No such player");

        var playerState = this.state.getPlayer(playerObject)!;

        if (selection != null && !(selection >= 0 && selection < playerState.cards.length))
            throw new UserError("Card index out of range");

        this.playSelection.set(playerObject, selection);
    }

    selectCardsToDraw(player: Player | string, selection: number[]) {
        if (this.turn.phase !== "card_draw")
            throw new UserError("Cannot draw in this turn phase");

        var playerObject = this.registry.getPlayer(player);
        if (playerObject == null) throw new UserError("No such player");

        var cardChoices = this.getCardChoice(playerObject);

        if (selection.length != this.getCardDrawCount(playerObject))
            throw new UserError("Wrong amount of cards selected");

        if (selection.length != new Set(selection).size)
            throw new UserError("Duplicate cards selected");

        for (var number of selection) {
            if (!(number >= 0 && number < cardChoices.length))
                throw new UserError("Card selection out of range");
        }

        selection.sort((a, b) => a - b);
        this.drawSelection.set(playerObject, selection);
    }

    getCardChoice(player: Player): CardType[] {
        return calculateCardChoice(this.state, this.turn, player, this.registry);
    }

    getCardDrawCount(player: Player): number {
        return Math.max(cardsInHand - this.state.getPlayer(player)!.cards.length, 0);
    }

    evaluateTurn() {
        switch (this.turn.phase) {
            case "card_usage":
                let turnResult = new TurnResult(this.state, this.turn, this.registry);
                let cardTypes: Map<Player, CardType> = new Map();

                for (let player of this.registry.listPlayers()) {
                    let selection = this.playSelection.get(player);

                    if (selection != null) {
                        let playerState = this.state.getPlayer(player)!;

                        cardTypes.set(player, playerState.cards[selection]);

                        playerState.cards.splice(selection, 1);
                    }
                }

                for (let player of this.registry.listPlayers()) {
                    let cardType = cardTypes.get(player);

                    if (cardType != null) {
                        cardType.effect(turnResult.createContext(player));
                    }
                }

                turnResult.apply();

            case "card_draw":
                for (let player of this.registry.listPlayers()) {
                    let selection = this.drawSelection.get(player);

                    if (selection == null) {
                        selection = [];

                        for (var i = 0; i < this.getCardDrawCount(player); i++) {
                            selection.push(i);
                        }
                    }

                    var options = this.getCardChoice(player);

                    for (var number of selection) {
                        this.state.getPlayer(player)!.cards.push(options[number]);
                    }
                }
        }

        if (isLastTurnInRound(this.turn)) {
            applyPassiveEffects(this.state, this.registry);
        }

        this.playSelection = this.createEmptySelection();
        this.drawSelection = this.createEmptySelection();
        this.turn = getNextTurn(this.turn);
    }
}
