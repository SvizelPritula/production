export enum ToastType {
    Error
}

export interface Toast {
    kind: ToastType,
    message: string
}
