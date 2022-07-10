import styles from "components/Timer.module.css";
import { useEffect, useState } from "react";
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
  const [time, setTime] = useState<number>(() => Date.now());

  const [clockState, setClockState] = useState<ClockState>({
    state: "suspended",
  });

  useSocket<ListenEvents, EmitEvents>(
    "/clock",
    {},
    (socket) => {
      socket.on("state", (state) => setClockState(state));
    },
    []
  );

  useEffect(() => {
    function callback() {
      setTime(() => Date.now());

      animationFrame = requestAnimationFrame(callback);
    }

    var animationFrame = requestAnimationFrame(callback);
    return () => cancelAnimationFrame(animationFrame);
  });

  if (clockState.state === "suspended") return null;

  var remainingTime =
    clockState.state === "running"
      ? clockState.time - time
      : clockState.remaining;
  remainingTime = Math.max(remainingTime, 0);

  var milliseconds = remainingTime;
  var seconds = Math.floor(milliseconds / 1000);
  var minutes = Math.floor(seconds / 60);

  seconds %= 60;

  return (
    <div className={styles.timer}>
      {minutes.toString().padStart(2, "0")}:
      {seconds.toString().padStart(2, "0")}
    </div>
  );
}
