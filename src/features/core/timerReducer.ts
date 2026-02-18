import type { TimerState, TimerAction } from "./types"

export function timerReducer(state: TimerState, action: TimerAction): TimerState {
    switch (action.type) {
        case "setRunning":
            return {
                ...state,
                timerIsRunning: action.running,
            }
        case "setDone":
            return {
                ...state,
                timerIsRunning: false,
                timerIsDone: true,
            }
        case "tick":
            return {
                ...state,
                timeLeft: action.timeLeft,
            }
        case "reset":
            return {
                timeLeft: action.timeLeft,
                timerIsRunning: false,
                timerIsDone: false,
            }
        default:
            return state;
    }
}