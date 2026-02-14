import React from 'react';

import type { Difficulty, GameCategoryState } from "../types";

import ItemTile from "./ItemTile";

import "./GameBoard.scss";

type Props = {
    gameBoard: GameCategoryState[];
    difficulty: Difficulty;
    onHandleTileClick: (catIdx: number, rowIdx: number) => void;
}

export default function GameBoard({ gameBoard, difficulty, onHandleTileClick }: Props) {
    const maxItems: number = Math.max(0, ...gameBoard.map(cat => cat.items.length));

    return (
      <main className="gameboard-container">
        <ul style={{gridTemplateColumns: `repeat(${gameBoard.length + 1}, 1fr)`}}>
          {/* Categories */}
          <li></li>
          {gameBoard.map((cat, catIdx) => (
            <li key={`cat-${catIdx}`} className="category-name">{cat.category}</li>
          ))}

          {/* Items */}
          {Array.from({ length: maxItems }).map((_, rowIdx) => (
            <React.Fragment key={`row-${rowIdx}`}>
              <li className="difficulty-name">{rowIdx < difficulty.list.length ? difficulty.list[rowIdx] : difficulty.default}</li>
              {gameBoard.map((cat, catIdx) => (
                <li key={`item-${catIdx}-${rowIdx}`}>
                    {cat.items[rowIdx] && <ItemTile item={cat.items[rowIdx]} onClick={() => onHandleTileClick(catIdx, rowIdx)} />}
                </li>
              ))}
            </React.Fragment>
          ))}
        </ul>
      </main>
    );
}