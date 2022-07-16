export enum ToastType {
    Error,
    Success
}

export interface Toast {
    kind: ToastType,
    message: string
}
