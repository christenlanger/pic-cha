import { createContext } from "react";

import type { Config } from "./types";
import type { GameCategoryState } from "@/shared/types";

export type ConfigContextValue = {
  status: "loading" | "loaded" | "error";
  config: Config;
  gameBoard: GameCategoryState[] | null;
};

export const ConfigContext = createContext<ConfigContextValue | null>(null);
