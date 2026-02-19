import { useState, useEffect, type ReactNode } from "react";

import { hashString } from "@/shared/utils/hashString";

import type { GameCategory, GameCategoryState } from "@/shared/types";
import { type SelectedItem, BoardStateHelper } from "./types";

import { GameBoardContext, type GameBoardContextValue } from "./GameBoardContext";

type Props = {
  initialGameBoard: GameCategoryState[];
  children: ReactNode;
};

const setInitialGameBoard = (gameBoard: GameCategory[]): GameCategoryState[] => {
  return gameBoard.map((cat) => ({
    category: cat.category,
    items: cat.items.map((item) => ({ ...item, isRevealed: false })),
  }));
};

async function loadBoard(gameBoard: GameCategoryState[]): Promise<GameCategoryState[]> {
  const serializedDefault = JSON.stringify(gameBoard);
  const defaultHash = await hashString(serializedDefault);

  const savedBoard = localStorage.getItem(BoardStateHelper.BOARD_STATE);
  const savedHash = localStorage.getItem(BoardStateHelper.BOARD_HASH);

  if (savedBoard && savedHash === defaultHash) {
    return JSON.parse(savedBoard);
  }

  localStorage.setItem(BoardStateHelper.BOARD_STATE, serializedDefault);
  localStorage.setItem(BoardStateHelper.BOARD_HASH, defaultHash);

  return gameBoard;
}

export default function GameBoardProvider({ initialGameBoard, children }: Props) {
  const [gameBoard, setGameBoard] = useState<GameCategoryState[]>([]);
  const [selectedItem, setSelectedItem] = useState<SelectedItem>(null);

  useEffect(() => {
    if (!initialGameBoard) return;

    const updateGameBoard = async () => {
      const defaultBoard = setInitialGameBoard(initialGameBoard);
      const loadedBoard = await loadBoard(defaultBoard);
      setGameBoard(loadedBoard);
    };

    updateGameBoard();
  }, [initialGameBoard]);

  const selectTile = (catIdx: number, rowIdx: number) => {
    setSelectedItem({ catIdx, rowIdx });
  };

  const deselectTile = () => {
    setSelectedItem(null);
  };

  const revealTile = () => {
    if (!selectedItem || gameBoard[selectedItem.catIdx].items[selectedItem.rowIdx].isRevealed)
      return;

    setGameBoard((prev) => {
      const update = prev.map((cat, c) => ({
        category: cat.category,
        items: cat.items.map((item, r) => ({
          ...item,
          isRevealed: selectedItem.catIdx == c && selectedItem.rowIdx == r ? true : item.isRevealed,
        })),
      }));

      localStorage.setItem(BoardStateHelper.BOARD_STATE, JSON.stringify(update));
      return update;
    });
  };

  const context: GameBoardContextValue = {
    gameBoard,
    selectedItem,
    selectTile,
    deselectTile,
    revealTile,
  };

  return <GameBoardContext.Provider value={context}>{children}</GameBoardContext.Provider>;
}
