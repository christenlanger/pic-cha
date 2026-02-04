import { useEffect, useContext } from "react";

import { ThemeContext } from "../context";
import { APP_DEFAULTS } from "../constants/app";

const LoadCSS = () => {
    const theme = useContext(ThemeContext);

    useEffect(() => {
        const link = document.createElement("link");

        link.rel = "stylesheet";
        link.href = `${theme}/${APP_DEFAULTS.cssFileName}`;
        link.id = "theme-css";
        document.head.appendChild(link);

        return () => {
            document.getElementById("theme-css")?.remove();
        };
    }, [theme]);

    return null;
}

export default LoadCSS;