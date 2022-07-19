import { GameState, GameStateChangeEffect, Player, Registry, Resource } from "src/game/types";

export class AddUnits implements GameStateChangeEffect {
    private readonly player: Player;
    private readonly resource: Resource;
    private readonly amount: number;

    constructor(player: Player, resource: Resource, amount: number) {
        this.player = player;
        this.resource = resource;
        this.amount = amount;
    }

    apply(state: GameState, registry: Registry): void {
        state.getPlayer(this.player)!.getResource(this.resource)!.amount += this.amount;
    }
}

export class AddProduction implements GameStateChangeEffect {
    private readonly player: Player;
    private readonly resource: Resource;
    private readonly amount: number;

    constructor(player: Player, resource: Resource, amount: number) {
        this.player = player;
        this.resource = resource;
        this.amount = amount;
    }

    apply(state: GameState, registry: Registry): void {
        state.getPlayer(this.player)!.getResource(this.resource)!.production += this.amount;
    }
}

export class AddUsage implements GameStateChangeEffect {
    private readonly player: Player;
    private readonly resource: Resource;
    private readonly amount: number;

    constructor(player: Player, resource: Resource, amount: number) {
        this.player = player;
        this.resource = resource;
        this.amount = amount;
    }

    apply(state: GameState, registry: Registry): void {
        state.getPlayer(this.player)!.getResource(this.resource)!.usage += this.amount;
    }
}

export class AddPoints implements GameStateChangeEffect {
    private readonly player: Player;
    private readonly amount: number;

    constructor(player: Player, amount: number) {
        this.player = player;
        this.amount = amount;
    }

    apply(state: GameState, registry: Registry): void {
        state.getPlayer(this.player)!.points += this.amount;
    }
}
