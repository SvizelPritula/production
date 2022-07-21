import { CardType, CardUsageTurn, CardDrawTurn, Turn, Player, Resource, GameState, Registry, BeforeGameTurn, AfterGameTurn } from "src/game/types";
import { AssetStore } from "src/assets";
import { Game } from "src/game/game";

export interface CardInfo {
    image: string;
    color: string;
}

export interface CardUsageTurnOptions {
    turn: CardUsageTurn;
    options: CardInfo[];
}

export interface CardDrawTurnOptions {
    turn: CardDrawTurn;
    options: CardInfo[];
    requiredSelections: number;
}

export interface BeforeGameTurnOptions {
    turn: BeforeGameTurn;
}

export interface AfterGameTurnOptions {
    turn: AfterGameTurn;
    points: number;
}

export type TurnOptions = CardUsageTurnOptions | CardDrawTurnOptions | BeforeGameTurnOptions | AfterGameTurnOptions;

interface PublicResourceInfo {
    id: string;
    color: string;
}

interface PublicPlayerResourceState {
    id: string;
    amount: number;
    production: number;
    usage: number;
}

interface PublicPlayerState {
    id: string;
    name: string;
    points: number;
    lastUsedCard: CardInfo | null;
    resources: PublicPlayerResourceState[];
}

export interface PublicGameState {
    turn: Turn;
    players: PublicPlayerState[];
    resources: PublicResourceInfo[];
}

export function getCardInfo(card: CardType, assets: AssetStore): CardInfo {
    return {
        image: assets.getImage(card.image),
        color: card.color
    }
}

export function serializeTurnOptions(player: Player, game: Game, assets: AssetStore): TurnOptions {
    var turn = game.state.turn;

    switch (turn.phase) {
        case "card_draw":
            return {
                turn: turn,
                options: game.getCardChoice(player).map(c => getCardInfo(c, assets)),
                requiredSelections: game.getCardDrawCount(player)
            }
        case "card_usage":
            return {
                turn: turn,
                options: game.state.getPlayer(player)!.cards.map(c => getCardInfo(c, assets))
            }
        case "after_game":
            return {
                turn: turn,
                points: game.state.getPlayer(player)!.points
            }
        default:
            return {
                turn: turn
            }
    }
}

function serializePublicResourceInfo(resource: Resource): PublicResourceInfo {
    return {
        id: resource.id,
        color: resource.color
    };
}

function serializePublicPlayerResourceState(player: Player, resource: Resource, game: Game): PublicPlayerResourceState {
    var { state } = game;
    var resourceState = state.getPlayer(player)!.getResource(resource)!;

    return {
        id: resource.id,
        amount: resourceState.amount,
        production: resourceState.production,
        usage: resourceState.usage
    };
}

function serializePublicPlayerState(player: Player, game: Game, assets: AssetStore): PublicPlayerState {
    var { state, registry } = game;
    var playerState = state.getPlayer(player)!;

    return {
        id: player.id,
        name: player.name,
        points: playerState.points,
        lastUsedCard: playerState.lastUsedCard != null ? getCardInfo(playerState.lastUsedCard, assets) : null,
        resources: registry.listResources().map(r => serializePublicPlayerResourceState(player, r, game))
    };
}

export function serializePublicGameState(game: Game, assets: AssetStore): PublicGameState {
    var { state, registry } = game;

    return {
        turn: state.turn,
        players: registry.listPlayers().map(p => serializePublicPlayerState(p, game, assets)),
        resources: registry.listResources().map(r => serializePublicResourceInfo(r))
    };
}
