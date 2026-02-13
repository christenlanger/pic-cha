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

export type Triggers = Record<string, Trigger | undefined>;

export interface Config {
    theme: string;
    timer: number;
    delay: number;
    bgm?: string;
    triggers: Triggers;
}

export type GameItemState = GameItem & {
    isRevealed: boolean;
}

export interface GameCategoryState {
    category: string;
    items: GameItemState[];
}

export type ConfigData = Config & {
    gameBoard: GameCategoryState;
}

export type TimerCallbacks = Record<number, () => void>;

export const StateHelper = {
    BOARD_STATE: "boardState",
    BOARD_HASH: "boardHash",
}

export type StateHelper = (typeof StateHelper)[keyof typeof StateHelper];