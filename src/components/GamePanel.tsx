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
    const theme = useContext(ThemeContext);

    function handleImgLoad() {
        setImgLoaded(true);
        setTimerIsRunning(true);
    }

    function toggleTimer() {
        setTimerIsRunning(prev => !prev);
    }

    function handleTimerFinish() {
        console.log("Timer finished!");
    }

    if (!item) return null;

    return (
        <dialog className="game-panel">
            <Timer max={timer} isRunning={timerIsRunning} onFinish={handleTimerFinish} />
            {item.isRevealed && <h2>{item.title}</h2>}
            {showHint && <p className="hint">{item.hint}</p>}

            <img src={`${theme}/${item.imgFile}`} onLoad={handleImgLoad} style={{ display: imgLoaded ? "inline" : "none" }} />
            {!imgLoaded && <p>Loading...</p>}

            <menu>
                <button onClick={() => {setShowHint(true)}} disabled={showHint}>Hint</button>
                <button onClick={onReveal} disabled={item.isRevealed}>Reveal</button>
                <button onClick={toggleTimer} disabled={item.isRevealed}>{timerIsRunning ? "Pause" : "Resume"} Timer</button>
                <button onClick={onClose}>Close</button>
            </menu>
        </dialog>
    );
}
