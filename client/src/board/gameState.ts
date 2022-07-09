import { Card } from "types/card";
import { Turn } from "types/turn";

export interface ResourceInfo {
    id: string;
    color: string;
}

export interface PlayerResourceState {
    id: string;
    amount: number;
    production: number;
    usage: number;
}

export interface PlayerState {
    id: string;
    name: string;
    points: number;
    lastUsedCard: Card | null;
    resources: PlayerResourceState[];
}

export interface GameState {
    turn: Turn;
    players: PlayerState[];
    resources: ResourceInfo[];
}