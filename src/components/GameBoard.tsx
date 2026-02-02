import React from 'react';

import type { GameCategoryState } from "../types";

import ItemTile from "./ItemTile";

import "./GameBoard.scss";

type Props = {
    gameBoard: GameCategoryState[];
    onHandleTileClick: (catIdx: number, rowIdx: number) => void;
}

export default function GameBoard({ gameBoard, onHandleTileClick }: Props) {
    const maxItems: number = Math.max(0, ...gameBoard.map(cat => cat.items.length));

    return (
      <main id="game-board">
        <ul style={{ gridTemplateColumns: `repeat(${gameBoard.length + 1}, minmax(0, 1fr))` }}>
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
      </main>
    );
}