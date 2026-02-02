import './App.scss'
import { useState } from 'react';
import type { GameCategory, GameCategoryState } from './types';
import { ThemeContext } from './context';
import { dummyConfig } from './dummy';

import GameBoard from './components/GameBoard';

function setInitialGameBoard(gameBoard: GameCategory[]): GameCategoryState[] {
  return gameBoard.map(cat => ({
      category: cat.category,
      items: cat.items.map(item => ({ ...item, isRevealed: false })),
  }));
}

function App() {
  const [gameBoard, setGameBoard] = useState<GameCategoryState[]>(setInitialGameBoard(dummyConfig.gameBoard));

  function handleTileClick(catIdx: number, rowIdx: number) {
    if (!gameBoard[catIdx].items[rowIdx].isRevealed) {
      setGameBoard(prev => prev.map((cat, c) => ({
        category: cat.category,
        items: cat.items.map((item, r) => ({ ...item, isRevealed: (catIdx == c && rowIdx == r ? true : item.isRevealed) }))
      })));
    }
  }

  return (
    <ThemeContext.Provider value={`/${dummyConfig.theme}`}>
      <h1>Pic Game</h1>
      <GameBoard gameBoard={gameBoard} onHandleTileClick={handleTileClick} />
    </ThemeContext.Provider>
  )
}

export default App
