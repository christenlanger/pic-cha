import { useReducer, useState, useEffect, type ReactNode } from "react"

import type { GameCategoryState } from "@/shared/types";
import type { ConfigState, ConfigAction } from "./types";

import { ConfigContext } from "./ConfigContext";

const configReducer = (state: ConfigState, action: ConfigAction): ConfigState => {
    switch (action.type) {
        case "LOAD_CONFIG":
            return {
                ...state,
                status: "loaded",
                config: action.payload,
            }
        case "SET_ERROR":
            return {
                status: "error"
            }
        default:
            return state;
    }
}

type Props = {
    srcFile: string;
    children: ReactNode;
}

export default function ConfigProvider({ srcFile, children }: Props) {
    const [configState, configDispatch] = useReducer(configReducer, null);
    const [gameBoard, setGameBoard] = useState<GameCategoryState[] | null>(null);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await fetch(srcFile);
                if (!res.ok) throw new Error("Failed to fetch config.");

                const data = await res.json();
                const { gameBoard, ...rest } = data;

                setGameBoard(gameBoard);
                configDispatch({ type: "LOAD_CONFIG", payload: rest });
                
            } catch(err) {
                console.error(err);
                configDispatch({ type: "SET_ERROR" })
            }
        }

        fetchConfig();
    }, [srcFile]);

    if (configState?.status !== "loaded") return;

    const context = { status: configState.status, config: configState.config, gameBoard }

    return (
        <ConfigContext.Provider value={context}>
            { children }
        </ConfigContext.Provider>
    );
}