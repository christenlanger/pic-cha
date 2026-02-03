import { useState, useEffect } from "react";

import type { TimerCallbacks } from "../types";

import "./Timer.scss";

type Props = {
    max: number;
    isRunning: boolean;
    onFinish: () => void;
    onTrigger?: TimerCallbacks;
}

export default function Timer({ max, isRunning, onFinish, onTrigger }: Props) {
    const [timeLeft, setTimeLeft] = useState<number>(max);

    useEffect(() => {
        setTimeLeft(max);
    }, [max]);

    useEffect(() => {
        if (!isRunning) return;

        const id = setInterval(() => {
            setTimeLeft(prev => {
                // End timer
                if (prev <= 0) {
                    clearInterval(id);
                    setTimeout(() => onFinish(), 0);
                    return 0;
                }

                // Check for callbacks
                onTrigger?.[prev - 1]?.();

                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(id);
    }, [isRunning, onFinish, onTrigger]);

    return (
        <div className="timer-container">
            {timeLeft}
        </div>
    );
}