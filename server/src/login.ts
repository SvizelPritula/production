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

export type LoginResult = UnknownLoginResult | BadPayloadResult | PlayerLoginResult | AdminLoginResult;

const adminCode = "admin";

export function loginByCode(code: string, registry: Registry): LoginResult {
    for (var player of registry.listPlayers()) {
        if (player.code == code) {
            return { success: true, kind: "player", player: player.id };
        }
    }

    if (code == adminCode) {
        return { success: true, kind: "admin" };
    }

    return { success: false, reason: "unknown_code" };
}
