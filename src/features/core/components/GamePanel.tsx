import { useState, useReducer, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { useConfig } from "@/features/config/useConfig";
import { useGameBoard } from "@/features/gameboard/useGameBoard";

import { GameController } from "@/classes/GameController";

import { timerReducer } from "../timerReducer";

import Timer from "./Timer";

import "./GamePanel.scss";

export default function GamePanel() {
    const { config } = useConfig();
    const { theme, timer, delay, loadingText } = config;
    const { selectedItem, gameBoard, revealTile, deselectTile } = useGameBoard();

    const [imgLoaded, setImgLoaded] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [timerState, timerDispatch] = useReducer(timerReducer, { timeLeft: timer, timerIsRunning: false, timerIsDone: false });

    const gameControllerRef = useRef<GameController | null>(null);
    const timeoutRef = useRef<number | null>(null);

    const gameController = gameControllerRef.current;

    const onTick = (timeLeft: number) => {
        timerDispatch({ type: "tick", timeLeft: timeLeft });
    };

    const onEnd = () => {
        timerDispatch({ type: "setDone" });
    };

    useEffect(() => {
        const { timer, delay, theme, triggers } = config;

        gameControllerRef.current?.stop();
        gameControllerRef.current = new GameController(timer, delay, theme, 1000, triggers, { onTick, onEnd });

        return () => {
            if (timeoutRef.current !== null) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [config]);

    if (!selectedItem || !gameBoard?.length) return;

    const item = gameBoard[selectedItem.catIdx].items[selectedItem.rowIdx];

    const resetPanel = () => {
        if (timeoutRef.current !== null) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setImgLoaded(false);
        setShowHint(false);
        timerDispatch({ type: "reset", timeLeft: timer });
        gameController?.reset();
    };

    const handleImgLoad = () => {
        if (timeoutRef.current !== null) return;

        timeoutRef.current = window.setTimeout(() => {
            setImgLoaded(true);
            timerDispatch({ type: "setRunning", running: true });
            if (!item?.isRevealed) gameController?.start();
            timeoutRef.current = null;
        }, item?.isRevealed ? 0 : Math.max(0, delay * 1000));
    };

    const toggleTimer = () => {
        if (timerState.timerIsRunning) {
            gameController?.stop();
            timerDispatch({ type: "setRunning", running: false });
        }
        else {
            gameController?.start();
            timerDispatch({ type: "setRunning", running: true });
        }
    };

    const handleReveal = () => {
        setShowHint(false);
        revealTile();
    };

    const handleClose = () => {
        resetPanel();
        deselectTile();
    };

    const canResumeTimer = item?.isRevealed || timerState.timerIsDone;
    const showTimer = !(item?.isRevealed || timerState.timerIsDone);

    return createPortal(
        <dialog className={`game-panel-container ${item ? "visible" : ""}`}>
            {showTimer && <Timer timeLeft={timerState.timeLeft} />}

            <div className={`title-container ${(item?.isRevealed && !showHint) ? "visible" : ""}`}>
                <p>{item?.title}</p>
            </div>

            <div className={`hint-container ${showHint ? "visible" : ""}`}>
                <p className="hint">{item?.hint}</p>
            </div>

            <div className="img-container">
                <img src={`${theme}/${item?.imgFile}`} onLoad={handleImgLoad} style={{ display: imgLoaded ? "inline" : "none" }} />
                {!imgLoaded && <p>{loadingText}</p>}
            </div>

            <form method="dialog" className="menu-container" onSubmit={handleClose}>
                {item?.hint && <li><button type="button" onClick={() => {setShowHint(prev => !prev)}}>Toggle Hint</button></li>}
                {!item?.isRevealed && <li><button type="button" onClick={handleReveal} disabled={timerState.timerIsRunning}>Reveal</button></li>}
                {showTimer && <li><button type="button" onClick={toggleTimer} disabled={canResumeTimer}>{timerState.timerIsRunning ? "Pause" : "Resume"} Timer</button></li>}
                <li><button type="submit">Close</button></li>
            </form>
        </dialog>,
        document.getElementById("modal-root")!
    );
}
