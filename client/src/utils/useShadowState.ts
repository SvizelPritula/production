import { useState } from "react"

export interface ShadowState<T> {
    value: T,
    isShadowed: boolean,
    setMain: (value: T | ((old: T) => T), clearShadow?: boolean) => void,
    setShadow: (value: T | ((old: T) => T)) => void
}

interface InternalShadowState<T> {
    main: T,
    shadow: T,
    isShadowed: boolean
}

export function useShadowState<T>(def: T): ShadowState<T> {
    var [values, setValues] = useState<InternalShadowState<T>>({ main: def, shadow: def, isShadowed: false });

    var { main, shadow, isShadowed } = values;

    return {
        isShadowed: isShadowed,
        value: isShadowed ? shadow : main,
        setMain(value, clearShadow = false) {
            setValues(old => {
                var oldValue = old.isShadowed ? old.shadow : old.main;
                var newValue = typeof value !== "function" ? value : (value as (old: T) => T)(oldValue);

                return {
                    main: newValue,
                    shadow: old.shadow,
                    isShadowed: clearShadow ? false : old.isShadowed
                };
            });
        },
        setShadow(value) {
            setValues(old => {
                var oldValue = old.isShadowed ? old.shadow : old.main;
                var newValue = typeof value !== "function" ? value : (value as (old: T) => T)(oldValue);

                return {
                    main: old.main,
                    shadow: newValue,
                    isShadowed: true
                };
            });
        },
    }
}
