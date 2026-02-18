import { useContext } from "react";
import { GameBoardContext } from "./GameBoardContext";

export const useGameBoard = () => {
    const context = useContext(GameBoardContext);

    if (!context) throw new Error("Unable to load GameBoardContext");
    return context;
}