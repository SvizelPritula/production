export interface SuccessfulLoginState {
    kind: "player" | "admin",
    code: string
}

export interface NoLoginState {
    kind: "none"
}

export type LoginState = NoLoginState | SuccessfulLoginState;
