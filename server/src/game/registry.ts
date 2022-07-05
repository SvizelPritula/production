import { Resource, Player, CardType } from "src/game/types";
import { resources } from "src/game/data/resources";
import { players } from "src/game/data/players";
import { cards } from "src/game/data/cards";

interface WithId {
    id: string;
}

function createIdMap<T extends WithId>(values: T[]): Map<string, T> {
    return new Map(values.map(v => [v.id, v]));
}

function getFromMapIfString<T>(map: Map<string, T>, key: string | T): T | null {
    if (typeof key === "string") {
        return map.get(key) ?? null;
    } else {
        return key;
    }
}

export class Registry {
    private readonly resourceArray: Resource[];
    private readonly resourceIdMap: Map<string, Resource>;

    private readonly playerArray: Player[];
    private readonly playerIdMap: Map<string, Player>;

    private readonly cardsArray: CardType[];
    private readonly cardsIdMap: Map<string, CardType>;

    constructor(values: { resources: Resource[], players: Player[], cards: CardType[] }) {
        this.resourceArray = values.resources;
        this.resourceIdMap = createIdMap(values.resources);

        this.playerArray = values.players;
        this.playerIdMap = createIdMap(values.players);

        this.cardsArray = values.cards;
        this.cardsIdMap = createIdMap(values.cards);
    }

    listResources(): Resource[] { return this.resourceArray; }
    getResource(id: string | Resource): Resource | null { return getFromMapIfString(this.resourceIdMap, id); }

    listPlayers(): Player[] { return this.playerArray; }
    getPlayer(id: string | Player): Player | null { return getFromMapIfString(this.playerIdMap, id); }

    listCards(): CardType[] { return this.cardsArray; }
    getCard(id: string | CardType): CardType | null { return getFromMapIfString(this.cardsIdMap, id); }
}

export const registry: Registry = new Registry({
    resources,
    players,
    cards
});
