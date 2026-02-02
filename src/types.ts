export interface GameItem {
    title: string;
    imgFile: string;
    hint?: string;
}

export interface GameCategory {
    category: string;
    items: GameItem[];
}

export interface Config {
    theme: string;
    timer: number;
    gameBoard: GameCategory[];
}

export type GameItemState = GameItem & {
    isRevealed: boolean;
}

export interface GameCategoryState {
    category: string;
    items: GameItemState[];
}

export type TimerCallbacks = Record<number, () => void>;