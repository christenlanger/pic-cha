import { useState } from "react";
import { useConfig } from "@/features/config/useConfig";

import type { GameItemState } from "@/shared/types";

type Props = {
    item: GameItemState
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function ItemTile({ item, ...props }: Props) {
    const { config } = useConfig();
    const { theme } = config;
    const [randomStyle] = useState(() => Math.random());

    return (
        <button {...props} className={item.isRevealed ? "item-bg-revealed" : "item-bg-random"} style={{ "--rand": randomStyle } as React.CSSProperties}>
            { item.isRevealed && <img src={`${theme}/${item.imgFile}`} /> }
        </button>
    );
}
