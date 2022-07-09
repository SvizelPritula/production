export interface SuccessfulLoginState {
    kind: "player" | "board" | "admin",
    code: string
}

export interface NoLoginState {
    kind: "none"
}

export type LoginState = NoLoginState | SuccessfulLoginState;
