import { createContext } from "react";
import type { GameCategoryState } from "@/shared/types";

export type GameBoardContextValue = {
  gameBoard: GameCategoryState[] | null;
  selectedItem: {
    catIdx: number;
    rowIdx: number;
  } | null;
  selectTile: (catIdx: number, rowIdx: number) => void;
  deselectTile: () => void;
  revealTile: () => void;
};

export const GameBoardContext = createContext<GameBoardContextValue | null>(null);
