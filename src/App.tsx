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
  });
  const [loadingText, setLoadingText] = useState<ReactNode | null>(<p>Loading config...</p>);
  const [gameBoard, setGameBoard] = useState<GameCategoryState[]>([]);
  const [selectedItem, setSelectedItem] = useState<{catIdx: number, rowIdx: number} | null>(null);

  function handleTileClick(catIdx: number, rowIdx: number) {
    setSelectedItem({catIdx, rowIdx});
  }

  function handleReveal() {
    if (selectedItem && !gameBoard[selectedItem.catIdx].items[selectedItem.rowIdx].isRevealed) {
      setGameBoard(prev => prev.map((cat, c) => ({
        category: cat.category,
        items: cat.items.map((item, r) => ({ ...item, isRevealed: (selectedItem.catIdx == c && selectedItem.rowIdx == r ? true : item.isRevealed) }))
      })));
    }
  }

  function handleClosePanel() {
    setSelectedItem(null);
  }

  useEffect(() => {
    console.log("entered useEffect");
    fetch("/config.json")
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
      })
      .catch((err) => setLoadingText(<p>Error loading config: {err.message}</p>));
  }, []);

  return (
    <ThemeContext.Provider value={`/${config.theme}`}>
      <LoadCSS />
      {gameBoard.length > 0 ?
        <GameBoard gameBoard={gameBoard} onHandleTileClick={handleTileClick} /> :
        loadingText
      }
      <GamePanel item={selectedItem && gameBoard[selectedItem.catIdx].items[selectedItem.rowIdx]} timer={config.timer} delay={config.delay} onReveal={handleReveal} onClose={handleClosePanel} />
    </ThemeContext.Provider>
  )
}
