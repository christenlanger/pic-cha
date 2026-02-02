import React from 'react';
import type { GameCategoryState } from "../types";
import ItemTile from "./ItemTile";

type Props = {
    gameBoard: GameCategoryState[];
    onHandleTileClick: (catIdx: number, rowIdx: number) => void;
}

export default function GameBoard({ gameBoard, onHandleTileClick }: Props) {
    const maxItems: number = Math.max(0, ...gameBoard.map(cat => cat.items.length));

    return (
      <section id="game-board">
        <ul className={`grid grid-cols-${gameBoard.length + 1} gap-4`}>
          {/* Categories */}
          <li></li>
          {gameBoard.map((cat, catIdx) => (
            <li key={`cat-${catIdx}`}>{cat.category}</li>
          ))}

          {/* Items */}
          {Array.from({ length: maxItems }).map((_, rowIdx) => (
            <React.Fragment key={`row-${rowIdx}`}>
              <li>Difficulty {rowIdx + 1}</li>
              {gameBoard.map((cat, catIdx) => (
                <li key={`item-${catIdx}-${rowIdx}`}>
                    {cat.items[rowIdx] !== undefined ?
                      <ItemTile item={cat.items[rowIdx]} onClick={() => onHandleTileClick(catIdx, rowIdx)} /> :
                      ""}
                </li>
              ))}
            </React.Fragment>
          ))}
        </ul>
      </section>
    );
}