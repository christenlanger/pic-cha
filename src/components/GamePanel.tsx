import { useState, useContext, useEffect, useRef } from "react";

import type { GameItemState } from "../types";

import { ThemeContext } from "../context";

import Timer from "./Timer";

import "./GamePanel.scss";

type Props = {
    item: GameItemState | null;
    timer: number;
    delay?: number;
    onReveal: () => void;
    onClose: () => void;
}

export default function GamePanel({ item, timer, delay = 0, onReveal, onClose }: Props) {
    const [imgLoaded, setImgLoaded] = useState<boolean>(false);
    const [showHint, setShowHint] = useState<boolean>(false);
    const [timerIsRunning, setTimerIsRunning] = useState<boolean>(false);
    const [timerIsDone, setTimerIsDone] = useState<boolean>(false);

    const theme = useContext(ThemeContext);
    const timeoutRef = useRef<number | null>(null);

    function resetPanel() {
        if (timeoutRef.current !== null) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setImgLoaded(false);
        setShowHint(false);
        setTimerIsRunning(false);
        setTimerIsDone(false);
    }

    function handleImgLoad() {
        if (timeoutRef.current !== null) return;

        timeoutRef.current = window.setTimeout(() => {
            setImgLoaded(true);
            setTimerIsRunning(true);
            timeoutRef.current = null;
        }, Math.max(0, delay));
    }

    function toggleTimer() {
        setTimerIsRunning(prev => !prev);
    }

    function handleTimerFinish() {
        setTimerIsRunning(false);
        setTimerIsDone(true);
    }

    function handleReveal() {
        setShowHint(false);
        onReveal();
    }

    function handleClose() {
        resetPanel();
        onClose();
    }

    useEffect(() => {
        return () => {
            if (timeoutRef.current !== null) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const canResumeTimer = item?.isRevealed || timerIsDone;
    const showTimer = !(item?.isRevealed || timerIsDone);

    return (
        <dialog className={`game-panel-container ${item && "visible"}`}>
            {showTimer && <Timer max={timer} isRunning={timerIsRunning} onFinish={handleTimerFinish} />}

            <div className={`title-container ${(item?.isRevealed && !showHint) && "visible"}`}>
                <p>{item?.title}</p>
            </div>

            <div className={`hint-container ${showHint && "visible"}`}>
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
