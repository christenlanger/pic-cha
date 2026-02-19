export type TimerStatus = "initial" | "running" | "paused" | "finished";

export type TimerHandle = {
  start: (delay: number) => void;
  stop: () => void;
  reset: () => void;
};

export type TimerHandlerOptions = {
  displayZeroDelay: number;
};

export const TimerHandlerOptionDefaults: TimerHandlerOptions = {
  displayZeroDelay: 0,
};

export type TimerHandlerCallbacks = {
  onTick?: (timeLeft: number) => void;
  onEnd?: () => void;
};
