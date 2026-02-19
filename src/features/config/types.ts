import type { Triggers } from "@/shared/types";

export interface Difficulty {
  default: string;
  list: string[];
}

export interface Config {
  theme: string;
  timer: number;
  delay: number;
  bgm?: string;
  loadingText?: string;
  triggers: Triggers;
  difficulty: Difficulty;
}

export type ConfigState =
  | {
      status: "loaded";
      config: Config;
    }
  | {
      status: "loading" | "error";
    }
  | null;

export type ConfigAction = { type: "LOAD_CONFIG"; payload: Config } | { type: "SET_ERROR" };
