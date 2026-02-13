import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';

import { StateHelper, type Config, type GameCategory, type GameCategoryState } from './types';
import { hashString } from './helpers/hashString';

import { ThemeContext } from './context';
import { APP_DEFAULTS } from './constants/app';

import LoadCSS from './utilities/LoadCSS';
import GameBoard from './components/GameBoard';
import GamePanel from './components/GamePanel';

import './App.css'

function setInitialGameBoard(gameBoard: GameCategory[]): GameCategoryState[] {
  return gameBoard.map(cat => ({
      category: cat.category,
      items: cat.items.map(item => ({ ...item, isRevealed: false })),
  }));
}

async function loadBoard(gameBoard: GameCategoryState[]): Promise<GameCategoryState[]> {
  const serializedDefault = JSON.stringify(gameBoard);
  const defaultHash = await hashString(serializedDefault);

  const savedBoard = localStorage.getItem(StateHelper.BOARD_STATE);
  const savedHash = localStorage.getItem(StateHelper.BOARD_HASH);

  if (savedBoard && savedHash === defaultHash) {
    return JSON.parse(savedBoard);
  }

  localStorage.setItem(StateHelper.BOARD_STATE, serializedDefault);
  localStorage.setItem(StateHelper.BOARD_HASH, defaultHash);
  
  return gameBoard;
}

export default function App() {
  const [config, setConfig] = useState<Config>({
    theme: APP_DEFAULTS.theme,
    timer: APP_DEFAULTS.timer,
    delay: APP_DEFAULTS.delay,
    triggers: {}
  });
  const [configLoaded, setConfigLoaded] = useState<boolean>(false);
  const [loadingText, setLoadingText] = useState<ReactNode | null>(<p>Loading config...</p>);
  const [gameBoard, setGameBoard] = useState<GameCategoryState[]>([]);
  const [selectedItem, setSelectedItem] = useState<{catIdx: number, rowIdx: number} | null>(null);

  const handleTileClick = (catIdx: number, rowIdx: number) => {
    setSelectedItem({catIdx, rowIdx});
  };

  const handleReveal = () => {
    if (selectedItem && !gameBoard[selectedItem.catIdx].items[selectedItem.rowIdx].isRevealed) {
      setGameBoard(prev => {
        const update = prev.map((cat, c) => ({
          category: cat.category,
          items: cat.items.map((item, r) => ({ ...item, isRevealed: (selectedItem.catIdx == c && selectedItem.rowIdx == r ? true : item.isRevealed) }))
        }));

        localStorage.setItem(StateHelper.BOARD_STATE, JSON.stringify(update));
        return update;
      });
    }
  };

  const handleClosePanel = () => {
    setSelectedItem(null);
  };

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && e.shiftKey && e.key === "X") {
        localStorage.clear();
        window.location.reload();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    async function fetchConfig() {
      try {
        const res = await fetch(`/config.json?ts=${Date.now()}`);

        if (!res.ok) {
          throw new Error("Failed to fetch config. Check if config.json exists.");
        }

        const data = await res.json();
        const {gameBoard, ...rest} = data;
        const defaultBoard = setInitialGameBoard(gameBoard);
        const loadedBoard = await loadBoard(defaultBoard);

        if (gameBoard) setGameBoard(loadedBoard);
        setConfig(rest);
        setConfigLoaded(true);
      }
      catch (err) {
        console.error(err);
        setLoadingText(<p>Failed to fetch config. Check if config.json exists.</p>)
      }
    }

    fetchConfig();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const configReady = gameBoard.length > 0 && configLoaded;

  return (
    <ThemeContext.Provider value={`/${config.theme}`}>
      <LoadCSS />
      {configReady ?
        <>
          <GameBoard gameBoard={gameBoard} onHandleTileClick={handleTileClick} />
          <GamePanel item={selectedItem && gameBoard[selectedItem.catIdx].items[selectedItem.rowIdx]} timer={config.timer} delay={config.delay} triggers={config.triggers} onReveal={handleReveal} onClose={handleClosePanel} />
        </> : loadingText
      }
    </ThemeContext.Provider>
  )
}
