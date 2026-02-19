import { Fragment } from "react";

import { useConfig } from "@/features/config/useConfig";
import { useGameBoard } from "../useGameBoard";

import ItemTile from "./ItemTile";

import "./GameBoard.scss";

export default function GameBoard() {
  const { config } = useConfig();
  const { difficulty } = config;
  const { gameBoard, selectTile } = useGameBoard();

  if (!gameBoard) return;

  const maxItems = Math.max(0, ...gameBoard.map((cat) => cat.items.length));

  return (
    <main className="gameboard-container">
      <ul style={{ gridTemplateColumns: `repeat(${gameBoard.length + 1}, 1fr)` }}>
        {/* Categories */}
        <li></li>
        {gameBoard.map((cat, catIdx) => (
          <li key={`cat-${catIdx}`} className="category-name">
            {cat.category}
          </li>
        ))}

        {/* Items */}
        {Array.from({ length: maxItems }).map((_, rowIdx) => (
          <Fragment key={`row-${rowIdx}`}>
            <li className="difficulty-name">
              {rowIdx < difficulty.list.length ? difficulty.list[rowIdx] : difficulty.default}
            </li>
            {gameBoard.map((cat, catIdx) => (
              <li key={`item-${catIdx}-${rowIdx}`}>
                {cat.items[rowIdx] && (
                  <ItemTile item={cat.items[rowIdx]} onClick={() => selectTile(catIdx, rowIdx)} />
                )}
              </li>
            ))}
          </Fragment>
        ))}
      </ul>
    </main>
  );
}
