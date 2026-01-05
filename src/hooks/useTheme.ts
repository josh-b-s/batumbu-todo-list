import {useEffect, useState} from "react";

type Theme = "Light" | "Dark"

export function useTheme() {
    const [theme, setTheme] = useState<Theme>(
        () => {
            try {
                const saved = localStorage.getItem("theme") as Theme | null;
                if (saved) return saved;
            } catch (e) {
            }
            return "Light"
        }
    );


    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem("theme", theme);
    }, [theme]);

    return {theme, toggle: () => setTheme(t => (t === "Dark" ? "Light" : "Dark")), isDark: theme === "Dark"};
}
