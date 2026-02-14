import { useState, useContext } from "react";

import type { GameItemState } from "../types";

import { ThemeContext } from "../context";

type Props = {
    item: GameItemState;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function ItemTile({ item, ...props }: Props) {
    const [randomStyle] = useState(() => Math.random());
    const theme = useContext(ThemeContext);

    return (
        <button {...props} onClick={props.onClick} className={item.isRevealed ? "item-bg-revealed" : "item-bg-random"} style={{ "--rand": randomStyle } as React.CSSProperties}>
            { item.isRevealed && <img src={`${theme}/${item.imgFile}`} /> }
        </button>
    );
}
