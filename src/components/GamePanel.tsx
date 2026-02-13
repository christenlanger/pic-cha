import { useState, useContext, useEffect, useRef } from "react";

import type { GameItemState, Triggers } from "../types";
import { GameController } from "../classes/GameController";

import Timer from "./Timer";

import { ThemeContext } from "../context";

import "./GamePanel.scss";

type Props = {
    item: GameItemState | null;
    timer: number;
    delay?: number;
    triggers: Triggers;
    onReveal: () => void;
    onClose: () => void;
}

export default function GamePanel({ item, timer, delay = 0, triggers, onReveal, onClose }: Props) {
    const [imgLoaded, setImgLoaded] = useState<boolean>(false);
    const [showHint, setShowHint] = useState<boolean>(false);
    const [timeLeft, setTimeLeft] = useState<number>(timer);
    const [timerIsRunning, setTimerIsRunning] = useState<boolean>(false);
    const [timerIsDone, setTimerIsDone] = useState<boolean>(false);

    const theme = useContext(ThemeContext);
    const timeoutRef = useRef<number | null>(null);

    const resetPanel = () => {
        if (timeoutRef.current !== null) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setImgLoaded(false);
        setShowHint(false);
        setTimeLeft(timer);
        setTimerIsRunning(false);
        setTimerIsDone(false);
        gameController?.reset();
    };

    const handleImgLoad = () => {
        if (timeoutRef.current !== null) return;

        timeoutRef.current = window.setTimeout(() => {
            setImgLoaded(true);
            setTimerIsRunning(true);
            if (!item?.isRevealed) gameController?.start();
            timeoutRef.current = null;
        }, Math.max(0, delay));
    };

    const toggleTimer = () => {
        if (timerIsRunning) {
            gameController?.stop();
            setTimerIsRunning(false);
        }
        else {
            gameController?.start();
            setTimerIsRunning(true);
        }
    };

    const handleReveal = () => {
        setShowHint(false);
        onReveal();
    };

    const handleClose = () => {
        resetPanel();
        onClose();
    };

    const onTick = (timeLeft: number) => {
        setTimeLeft(timeLeft);
    };

    const onEnd = () => {
        setTimerIsRunning(false);
        setTimerIsDone(true);
    };

    const gameControllerRef = useRef<GameController | null>(null);
    const gameController = gameControllerRef.current;

    useEffect(() => {
        gameControllerRef.current?.stop();
        gameControllerRef.current = new GameController(timer, delay, theme, 1000, triggers, { onTick, onEnd });

        return () => {
            if (timeoutRef.current !== null) {
                clearTimeout(timeoutRef.current);
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const canResumeTimer = item?.isRevealed || timerIsDone;
    const showTimer = !(item?.isRevealed || timerIsDone);

    return (
        <dialog className={`game-panel-container ${item ? "visible" : ""}`}>
            {showTimer && <Timer timeLeft={timeLeft} />}

            <div className={`title-container ${(item?.isRevealed && !showHint) ? "visible" : ""}`}>
                <p>{item?.title}</p>
            </div>

            <div className={`hint-container ${showHint ? "visible" : ""}`}>
                <p className="hint">{item?.hint}</p>
            </div>

            <div className="img-container">
                <img src={`${theme}/${item?.imgFile}`} onLoad={handleImgLoad} style={{ display: imgLoaded ? "inline" : "none" }} />
                {!imgLoaded && <p>Loading...</p>}
            </div>

            <menu className="menu-container">
                {item?.hint && <li><button onClick={() => {setShowHint(prev => !prev)}}>Toggle Hint</button></li>}
                {!item?.isRevealed && <li><button onClick={handleReveal} disabled={timerIsRunning}>Reveal</button></li>}
                {showTimer && <li><button onClick={toggleTimer} disabled={canResumeTimer}>{timerIsRunning ? "Pause" : "Resume"} Timer</button></li>}
                <li><button onClick={handleClose}>Close</button></li>
            </menu>
        </dialog>
    );
}
