import { useEffect } from "react";
import { useConfig } from "@/features/config/useConfig";

const LoadCSS = () => {
  const { config } = useConfig();

  useEffect(() => {
    const link = document.createElement("link");

    link.rel = "stylesheet";
    link.href = `/${config.theme}/style.css`;
    link.id = "theme-css";
    document.head.appendChild(link);

    return () => {
      document.getElementById("theme-css")?.remove();
    };
  }, [config]);

  return null;
};

export default LoadCSS;
