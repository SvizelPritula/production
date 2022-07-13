import { useEffect, useRef, useState } from "react";

import styles from "components/Timer.module.css";

import { ClockAdjuster } from "utils/clockAdjuster";
import { useSocket } from "utils/useSocket";

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

export type ClockState =
  | RunningClockState
  | PausedClockState
  | SuspendedClockState;

interface ListenEvents {
  state: (state: ClockState) => void;
}

interface EmitEvents {
  get_time: () => Promise<number>;
}

export default function Timer() {
  const [clockAdjuster] = useState<ClockAdjuster>(() => new ClockAdjuster());

  const [seconds, setSeconds] = useState<number | null>(null);

  const clockStateRef = useRef<ClockState>({
    state: "suspended",
  });

  useSocket<ListenEvents, EmitEvents>(
    "/clock",
    {},
    (socket, emit, emitAck) => {
      socket.on("state", (state) => {
        clockStateRef.current = state;
      });

      async function checkServerTime() {
        try {
          const start = Date.now();
          const server = await emitAck("get_time");
          const end = Date.now();

          const client = Math.floor((start + end) / 2);
          const skew = server - client;

          clockAdjuster.recordSkew(skew);
        } catch (err) {
          console.error(err);
        }
      }

      const interval = setInterval(checkServerTime, 1000);
      checkServerTime();

      return () => clearInterval(interval);
    },
    []
  );

  useEffect(() => {
    function callback() {
      const clockState = clockStateRef.current;

      if (clockState.state !== "suspended") {
        var time = clockAdjuster.getTime();

        var remainingTime =
          clockState.state === "running"
            ? clockState.time - time
            : clockState.remaining;

        remainingTime = Math.max(remainingTime, 0);

        var milliseconds = remainingTime;
        var seconds = Math.floor(milliseconds / 1000);

        setSeconds(seconds);
      } else {
        setSeconds(null);
      }

      animationFrame = requestAnimationFrame(callback);
    }

    var animationFrame = requestAnimationFrame(callback);
    return () => cancelAnimationFrame(animationFrame);
  });

  if (seconds == null) return null;

  const minutes = Math.floor(seconds / 60);

  const minutesString = minutes.toString().padStart(2, "0");
  const secondsString = (seconds % 60).toString().padStart(2, "0");

  return (
    <div className={styles.timer}>
      {minutesString}:{secondsString}
    </div>
  );
}
