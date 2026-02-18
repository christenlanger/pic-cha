export interface GameItem {
    title: string;
    imgFile: string;
    hint?: string;
}

export interface GameCategory {
    category: string;
    items: GameItem[];
}

export type GameItemState = GameItem & {
    isRevealed: boolean;
}

export interface GameCategoryState {
    category: string;
    items: GameItemState[];
}

export type TimerCallbacks = Record<number, () => void>;

export interface Trigger {
    bgm?: string;
    sfx?: string;
    addClass?: string;
}

export type Triggers = Record<string, Trigger | undefined>;