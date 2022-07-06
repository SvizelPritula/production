import { GameState, Registry } from "src/game/types"

export function applyPassiveEffects(state: GameState, registry: Registry) {
    for (var player of registry.listPlayers()) {
        var playerState = state.getPlayer(player)!;
        var pointsGenerated = 0;

        for (var resource of registry.listResources()) {
            var resourceQuantities = playerState.getResource(resource)!;

            var consumedUnits = Math.min(resourceQuantities.amount, resourceQuantities.usage);
            resourceQuantities.amount -= consumedUnits;
            pointsGenerated += consumedUnits * resource.pointsPerUnit;

            var generatedUnits = resourceQuantities.production;
            resourceQuantities.amount += generatedUnits;
        }

        playerState.points += pointsGenerated;
    }
}
