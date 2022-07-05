import { registry } from "src/game/registry";
import { GameState, Player, Turn, Registry, getFirstTurn, ArgumentError, TurnResult, CardType, getNextTurn } from "src/game/types";

export class Game {
    readonly registry: Registry;
    readonly state: GameState;
    turn: Turn;

    selection: Map<Player, number | null>;

    constructor() {
        this.registry = registry;

        this.turn = getFirstTurn();
        this.state = new GameState(this.registry);
        this.selection = this.createEmptySelection();
    }

    private createEmptySelection() {
        var map = new Map();

        for (const player of this.registry.listPlayers()) {
            map.set(player, null);
        }

        return map;
    }

    selectCard(player: Player | string, selection: number | null) {
        var playerObject = this.registry.getPlayer(player);
        if (playerObject == null) throw new ArgumentError("No such player");

        var playerState = this.state.getPlayer(playerObject)!;

        if (selection != null && !(selection >= 0 && selection < playerState.cards.length))
            throw new ArgumentError("Card index out of range");

        this.selection.set(playerObject, selection);
    }

    evaluateTurn() {
        var turnResult = new TurnResult(this.state, this.turn, this.registry);
        var cardTypes: Map<Player, CardType> = new Map();

        for (var player of this.registry.listPlayers()) {
            var selection = this.selection.get(player);

            if (selection != null) {
                var playerState = this.state.getPlayer(player)!;

                cardTypes.set(player, playerState.cards[selection]);

                playerState.cards.splice(selection, 1);
            }
        }

        for (var player of this.registry.listPlayers()) {
            var cardType = cardTypes.get(player);

            if (cardType != null) {
                cardType.effect(turnResult.createContext(player));
            }
        }

        turnResult.apply();


        for (var player of this.registry.listPlayers()) {
            var playerState = this.state.getPlayer(player)!;

            for (var resource of this.registry.listResources()) {
                var resourceQuantities = playerState.getResource(resource)!;

                var consumedUnits = Math.min(resourceQuantities.amount, resourceQuantities.usage);
                resourceQuantities.amount -= consumedUnits;
                playerState.points += consumedUnits * resource.pointsPerUnit;

                var generatedUnits = resourceQuantities.production;
                resourceQuantities.amount += generatedUnits;
            }
        }

        this.selection = this.createEmptySelection();
        this.turn = getNextTurn(this.turn);
    }
}
