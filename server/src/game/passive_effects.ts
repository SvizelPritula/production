import { GameState, isLastTurnInRound, Registry } from "src/game/types"

export function applyPassiveEffects(state: GameState, registry: Registry) {
    for (var player of registry.listPlayers()) {
        var playerState = state.getPlayer(player)!;

        for (var resource of registry.listResources()) {
            var resourceQuantities = playerState.getResource(resource)!;

            resourceQuantities.amount = Math.max(resourceQuantities.amount, 0);
            resourceQuantities.production = Math.max(resourceQuantities.production, 0);
            resourceQuantities.usage = Math.max(resourceQuantities.usage, 0);
        }
    }

    if (isLastTurnInRound(state.turn)) {
        for (var player of registry.listPlayers()) {
            var playerState = state.getPlayer(player)!;

            for (var resource of registry.listResources()) {
                var resourceQuantities = playerState.getResource(resource)!;

                var producedUnits = resourceQuantities.production * resource.getUnitsPerProducer(state.turn);
                resourceQuantities.amount += producedUnits;

                var usedUnits = Math.min(resourceQuantities.usage, resourceQuantities.amount);
                resourceQuantities.amount -= usedUnits;

                playerState.points += usedUnits * resource.getPointsPerUnit(state.turn);

                if (resource.volatile) {
                    resourceQuantities.amount = 0;
                }
            }
        }
    }
}
