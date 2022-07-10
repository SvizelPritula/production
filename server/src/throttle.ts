import EventEmitter from "events";

export class Throttle<T> extends EventEmitter {
    state: T | null;
    private delay: number;
    private timeout: NodeJS.Timeout | null;

    constructor(delay: number) {
        super();

        this.delay = delay;
        this.state = null;
        this.timeout = null;
    }

    private callback() {
        this.timeout = null;
        this.emit("event", this.state!);
    }

    send(state: T) {
        if (this.timeout === null) {
            this.timeout = setTimeout(this.callback.bind(this), this.delay);
        }

        this.state = state;
    }
}

interface ThrottleEvents<T> {
    'event': (state: T) => void;
}

export declare interface Throttle<T> {
    on<U extends keyof ThrottleEvents<T>>(
        event: U, listener: ThrottleEvents<T>[U]
    ): this;

    emit<U extends keyof ThrottleEvents<T>>(
        event: U, ...args: Parameters<ThrottleEvents<T>[U]>
    ): boolean;
}
