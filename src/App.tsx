import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';

import type { Config, GameCategory, GameCategoryState } from './types';

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
      setGameBoard(prev => prev.map((cat, c) => ({
        category: cat.category,
        items: cat.items.map((item, r) => ({ ...item, isRevealed: (selectedItem.catIdx == c && selectedItem.rowIdx == r ? true : item.isRevealed) }))
      })));
    }
  };

  const handleClosePanel = () => {
    setSelectedItem(null);
  };

  useEffect(() => {
    console.log("entered useEffect");
    fetch(`/config.json?ts=${Date.now()}`)
      .then((res) => {
        if (!res.ok) {
          setLoadingText(<p>Failed to fetch config. Check if config.json exists.</p>);
          throw new Error("Failed to fetch config. Check if config.json exists.");
        }
        return res.json();
      })
      .then((data) => {
        const {gameBoard, ...rest} = data;
        setConfig(rest);
        if (gameBoard) setGameBoard(setInitialGameBoard(gameBoard));
        setConfigLoaded(true);
      })
      .catch((err) => setLoadingText(<p>Error loading config: {err.message}</p>));
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
