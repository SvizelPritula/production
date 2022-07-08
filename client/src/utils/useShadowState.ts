import { useState } from "react"

export interface ShadowState<T> {
    value: T,
    isShadowed: boolean,
    setMain: (value: T | ((old: T) => T), clearShadow?: boolean) => void,
    setShadow: (value: T | ((old: T) => T)) => void
}

export function useShadowState<T>(def: T): ShadowState<T> {
    var [main, setMain] = useState<T>(def);
    var [shadow, setShadow] = useState<T>(def);
    var [isShadowed, setShadowed] = useState<boolean>(false);

    return {
        isShadowed: isShadowed,
        value: isShadowed ? shadow : main,
        setMain(value, clearShadow = false) {
            setMain(value);
            if (clearShadow) setShadowed(false);
        },
        setShadow(value) {
            setShadow(value);
            setShadowed(true);
        },
    }
}
