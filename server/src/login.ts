import { Registry } from "./game/types";

interface UnknownLoginResult {
    success: false;
    reason: "unknown_code";
}

interface BadPayloadResult {
    success: false;
    reason: "bad_payload";
}

interface PlayerLoginResult {
    success: true;
    kind: "player";
    player: string;
}

interface AdminLoginResult {
    success: true;
    kind: "admin";
}

interface BoardLoginResult {
    success: true;
    kind: "board";
}

export type LoginResult = UnknownLoginResult | BadPayloadResult | PlayerLoginResult | AdminLoginResult | BoardLoginResult;

const adminCode = "admin";
const boardCode = "board";

export function loginByCode(code: string, registry: Registry): LoginResult {
    for (var player of registry.listPlayers()) {
        if (player.code == code) {
            return { success: true, kind: "player", player: player.id };
        }
    }

    if (code == adminCode) {
        return { success: true, kind: "admin" };
    }

    if (code == boardCode) {
        return { success: true, kind: "board" };
    }

    return { success: false, reason: "unknown_code" };
}
