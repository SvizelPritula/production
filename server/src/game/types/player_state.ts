import { Resource, CardType, Registry } from "src/game/types";

export class ResourceQuantities {
    amount: number = 0;
    production: number = 0;
    usage: number = 0;
}

export class PlayerState {
    readonly resources: Map<Resource, ResourceQuantities>;
    cards: CardType[];
    points: number;

    private readonly registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;

        this.resources = new Map();

        for (const resource of this.registry.listResources()) {
            this.resources.set(resource, new ResourceQuantities());
        }

        this.cards = [];
        this.points = 0;
    }

    getResource(resource: Resource | string): ResourceQuantities | null {
        var resourceObject = this.registry.getResource(resource);
        if (resourceObject == null) return null;
        return this.resources.get(resourceObject) ?? null;
    }
}
