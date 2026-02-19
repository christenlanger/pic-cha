import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { useConfig } from "@/features/config/useConfig";
import { useGameBoard } from "@/features/gameboard/useGameBoard";

import type { TimerHandle, TimerStatus } from "@/features/timer/types";

import TimerHandler from "@/features/timer/TimerHandler";

import "./GamePanel.scss";

export default function GamePanel() {
  const { config } = useConfig();
  const { theme, delay, loadingText } = config;
  const { selectedItem, gameBoard, revealTile, deselectTile } = useGameBoard();

  const [imgLoaded, setImgLoaded] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [timerStatus, setTimerStatus] = useState<TimerStatus>("initial");
  const timerRef = useRef<TimerHandle | null>(null);

  const timeoutRef = useRef<number | null>(null);

  const onEnd = () => {
    setTimerStatus("finished");
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!selectedItem || !gameBoard?.length) return;

  const item = gameBoard[selectedItem.catIdx].items[selectedItem.rowIdx];

  const resetPanel = () => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setImgLoaded(false);
    setShowHint(false);
    setTimerStatus("initial");
    timerRef.current?.reset();
  };

  const handleImgLoad = () => {
    if (timeoutRef.current !== null) return;

    timeoutRef.current = window.setTimeout(
      () => {
        setImgLoaded(true);
        setTimerStatus("running");
        if (!item?.isRevealed) timerRef.current?.start(delay);
        timeoutRef.current = null;
      },
      item?.isRevealed ? 0 : Math.max(0, delay * 1000),
    );
  };

  const toggleTimer = () => {
    if (timerStatus === "running") {
      timerRef.current?.stop();
      setTimerStatus("paused");
    } else {
      timerRef.current?.start(0);
      setTimerStatus("running");
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

  const canResumeTimer = item?.isRevealed || timerStatus === "finished";
  const showTimer = !(item?.isRevealed || timerStatus === "finished");

  return createPortal(
    <dialog className={`game-panel-container ${item ? "visible" : ""}`}>
      {showTimer && (
        <TimerHandler ref={timerRef} options={{ displayZeroDelay: 1000 }} callbacks={{ onEnd }} />
      )}

      <div className={`title-container ${item?.isRevealed && !showHint ? "visible" : ""}`}>
        <p>{item?.title}</p>
      </div>

      <div className={`hint-container ${showHint ? "visible" : ""}`}>
        <p className="hint">{item?.hint}</p>
      </div>

      <div className="img-container">
        <img
          src={`${theme}/${item?.imgFile}`}
          onLoad={handleImgLoad}
          style={{ display: imgLoaded ? "inline" : "none" }}
        />
        {!imgLoaded && <p>{loadingText}</p>}
      </div>

      <form method="dialog" className="menu-container" onSubmit={handleClose}>
        {item?.hint && (
          <li>
            <button
              type="button"
              onClick={() => {
                setShowHint((prev) => !prev);
              }}
            >
              Toggle Hint
            </button>
          </li>
        )}
        {!item?.isRevealed && (
          <li>
            <button type="button" onClick={handleReveal} disabled={timerStatus === "running"}>
              Reveal
            </button>
          </li>
        )}
        {showTimer && (
          <li>
            <button type="button" onClick={toggleTimer} disabled={canResumeTimer}>
              {timerStatus === "running" ? "Pause" : "Resume"} Timer
            </button>
          </li>
        )}
        <li>
          <button type="submit">Close</button>
        </li>
      </form>
    </dialog>,
    document.getElementById("modal-root")!,
  );
}
