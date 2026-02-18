export type TimerState = {
    timeLeft: number;
    timerIsRunning: boolean;
    timerIsDone: boolean;
}

export type TimerAction =
    | { type: "setRunning", running: boolean }
    | { type: "setDone" }
    | { type: "tick", timeLeft: number }
    | { type: "reset", timeLeft: number }