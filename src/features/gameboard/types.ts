export type SelectedItem = {
  catIdx: number;
  rowIdx: number;
} | null;

export const BoardStateHelper = {
  BOARD_STATE: "boardState",
  BOARD_HASH: "boardHash",
};

export type BoardStateHelper = (typeof BoardStateHelper)[keyof typeof BoardStateHelper];
