import EventEmitter from "events";
import { UserError } from "src/game/types";

export interface RunningClockState {
    state: "running";
    time: number;
}

export interface PausedClockState {
    state: "paused";
    remaining: number;
}

export interface SuspendedClockState {
    state: "suspended";
}

export type ClockState = RunningClockState | PausedClockState | SuspendedClockState;

export class Clock extends EventEmitter {
    state: ClockState;
    private timeout: NodeJS.Timeout | null;

    constructor() {
        super();

        this.timeout = null;
        this.state = { state: "suspended" };
    }

    private callback() {
        this.timeout = null;
        this.suspend();
        this.emit("alarm");
    }

    private putState(state: ClockState) {
        if (this.timeout !== null) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }

        if (state.state === "running") {
            this.timeout = setTimeout(this.callback.bind(this), state.time - Date.now());
        }

        this.state = state;
        this.emit("state_change", state);
    }

    start(time: number) {
        this.putState({ state: "running", time: Date.now() + time });
    }

    suspend() {
        this.putState({ state: "suspended" });
    }

    pause() {
        if (this.state.state === "running") {
            this.putState({ state: "paused", remaining: this.state.time - Date.now() });
        } else if (this.state.state === "suspended") {
            throw new UserError("Cannot pause suspended clock");
        }
    }

    resume() {
        if (this.state.state === "paused") {
            this.putState({ state: "running", time: Date.now() + this.state.remaining });
        } else if (this.state.state === "suspended") {
            throw new UserError("Cannot resume suspended clock");
        }
    }

    setTime(time: number) {
        if (this.state.state === "running") {
            this.putState({ state: "running", time: Date.now() + time });
        } else {
            this.putState({ state: "paused", remaining: time });
        }
    }

    addTime(time: number) {
        if (this.state.state === "running") {
            this.putState({ state: "running", time: this.state.time + time });
        } else if (this.state.state === "paused") {
            this.putState({ state: "paused", remaining: this.state.remaining + time });
        } else if (this.state.state === "suspended") {
            throw new UserError("Cannot add time to suspended clock");
        }
    }
}

interface ClockEvents {
    'alarm': () => void;
    'state_change': (state: ClockState) => void;
}

export declare interface Clock {
    on<U extends keyof ClockEvents>(
        event: U, listener: ClockEvents[U]
    ): this;

    emit<U extends keyof ClockEvents>(
        event: U, ...args: Parameters<ClockEvents[U]>
    ): boolean;
}
