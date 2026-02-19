import { useEffect } from "react";
import { useConfig } from "./features/config/useConfig";

import type { ConfigContextValue } from "./features/config/ConfigContext";

import GameBoardProvider from "./features/gameboard/GameBoardProvider";

import LoadCSS from "./features/core/components/LoadCSS";
import GameBoard from "./features/gameboard/components/GameBoard";
import GamePanel from "./features/core/components/GamePanel";

import "./App.css";

export default function App() {
  const configState: ConfigContextValue = useConfig();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && e.shiftKey && e.key === "X") {
        localStorage.clear();
        window.location.reload();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const { status, gameBoard } = configState;
  const configReady = status === "loaded" && gameBoard?.length;
  const loadingTextOutput = {
    loading: <p>Loading config...</p>,
    loaded: null,
    error: <p>Failed to fetch config. Check if config.json exists.</p>,
  };

  return (
    <>
      <LoadCSS />
      {configReady ? (
        <GameBoardProvider initialGameBoard={gameBoard}>
          <GameBoard />
          <GamePanel />
        </GameBoardProvider>
      ) : (
        loadingTextOutput[status]
      )}
    </>
  );
}
