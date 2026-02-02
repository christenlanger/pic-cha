export type GameItem = {
    title: string;
    imgFile: string;
    hint?: string;
}

export interface GameCategory {
    category: string;
    items: GameItem[];
}

export type Config = {
    theme: string;
    gameBoard: GameCategory[];
}

export type GameItemState = GameItem & {
    isRevealed: boolean;
}

export type GameCategoryState = {
    category: string;
    items: GameItemState[];
}