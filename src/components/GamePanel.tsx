import { useState, useContext } from "react";

import type { GameItemState } from "../types";

import { ThemeContext } from "../context";

import Timer from "./Timer";

import "./GamePanel.scss";

type Props = {
    item: GameItemState | null;
    timer: number;
    onReveal: () => void;
    onClose: () => void;
}

export default function GamePanel({ item, timer, onReveal, onClose }: Props) {
    const [imgLoaded, setImgLoaded] = useState<boolean>(false);
    const [showHint, setShowHint] = useState<boolean>(false);
    const [timerIsRunning, setTimerIsRunning] = useState<boolean>(false);
    const [timerIsDone, setTimerIsDone] = useState<boolean>(false);
    const theme = useContext(ThemeContext);

    function handleImgLoad() {
        setImgLoaded(true);
        setTimerIsRunning(true);
    }

    function toggleTimer() {
        setTimerIsRunning(prev => !prev);
    }

    function handleTimerFinish() {
        setTimerIsRunning(false);
        setTimerIsDone(true);
        console.log("Timer finished!");
    }

    function handleReveal() {
        setShowHint(false);
        onReveal();
    }

    if (!item) return null;

    const canResumeTimer = item?.isRevealed || timerIsDone;
    const showTimer = !(item?.isRevealed || timerIsDone);

    return (
        <dialog className="game-panel-container">
            {showTimer && <Timer max={timer} isRunning={timerIsRunning} onFinish={handleTimerFinish} />}

            <div className={`title-container ${(item.isRevealed && !showHint) && "visible"}`}>
                <p>{item.title}</p>
            </div>

            <div className={`hint-container ${showHint && "visible"}`}>
                <p className="hint">{item.hint}</p>
            </div>

            <div className="img-container">
                <img src={`${theme}/${item.imgFile}`} onLoad={handleImgLoad} style={{ display: imgLoaded ? "inline" : "none" }} />
                {!imgLoaded && <p>Loading...</p>}
            </div>

            <menu className="menu-container">
                <li><button onClick={() => {setShowHint(prev => !prev)}}>Toggle Hint</button></li>
                {!item.isRevealed && <li><button onClick={handleReveal} disabled={timerIsRunning}>Reveal</button></li>}
                {showTimer && <li><button onClick={toggleTimer} disabled={canResumeTimer}>{timerIsRunning ? "Pause" : "Resume"} Timer</button></li>}
                <li><button onClick={onClose}>Close</button></li>
            </menu>
        </dialog>
    );
}
