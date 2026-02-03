import { useEffect, useContext } from "react";
import { ThemeContext } from "../context";

const LoadCSS = () => {
    const theme = useContext(ThemeContext);

    useEffect(() => {
        const link = document.createElement("link");

        link.rel = "stylesheet";
        link.href = `${theme}/style.css`;
        link.id = "theme-css";
        document.head.appendChild(link);

        return () => {
            document.getElementById("theme-css")?.remove();
        };
    }, [theme]);

    return null;
}

export default LoadCSS;