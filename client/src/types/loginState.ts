export interface PlayerLoginState {
    kind: "player",
    id: string,
    code: string
}

export interface NoLoginState {
    kind: "none"
}

export type LoginState = NoLoginState | PlayerLoginState;
