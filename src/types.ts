export interface GameItem {
    title: string;
    imgFile: string;
    hint?: string;
}

export interface GameCategory {
    category: string;
    items: GameItem[];
}

export interface Trigger {
    bgm?: string;
    sfx?: string;
    addClass?: string;
}

export interface Config {
    theme: string;
    timer: number;
    delay: number;
    bgm?: string;
    triggers?: {
        [key: string]: Trigger;
    };
}

export type GameItemState = GameItem & {
    isRevealed: boolean;
}

export interface GameCategoryState {
    category: string;
    items: GameItemState[];
}

export type TimerCallbacks = Record<number, () => void>;