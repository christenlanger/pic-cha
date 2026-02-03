import { useState } from 'react';

import type { GameCategory, GameCategoryState } from './types';

import { ThemeContext } from './context';
import { dummyConfig } from './dummy';

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
  const [gameBoard, setGameBoard] = useState<GameCategoryState[]>(setInitialGameBoard(dummyConfig.gameBoard));
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

  return (
    <ThemeContext.Provider value={`/${dummyConfig.theme}`}>
      <LoadCSS />
      <GameBoard gameBoard={gameBoard} onHandleTileClick={handleTileClick} />
      {selectedItem && <GamePanel item={gameBoard[selectedItem.catIdx].items[selectedItem.rowIdx]} timer={dummyConfig.timer} onReveal={handleReveal} onClose={handleClosePanel} />}
    </ThemeContext.Provider>
  )
}
