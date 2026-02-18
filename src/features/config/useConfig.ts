import { useContext } from "react";
import { ConfigContext } from "./ConfigContext";

export const useConfig = () => {
    const context = useContext(ConfigContext);

    if (!context) throw new Error("Unable to load ConfigContext");
    return context;
}