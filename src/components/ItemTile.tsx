import { useContext } from "react";
import type { GameItemState } from "../types";
import { ThemeContext } from "../context";

type Props = {
    item: GameItemState;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function ItemTile({ item, ...props }: Props) {
    const theme = useContext(ThemeContext);

    return (
        <button {...props} onClick={item.isRevealed ? undefined : props.onClick}>
            { item.isRevealed ? <img src={`${theme}/${item.imgFile}`} /> : "hidden" }
        </button>
    );
}
