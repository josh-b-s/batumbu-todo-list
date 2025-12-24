import { useEffect, useState } from "react";

export function useTheme() {
    const [theme, setTheme] = useState<"Light" | "Dark">(
        ()=>{
            try {
                const saved = localStorage.getItem("theme") as "Light" | "Dark" | null;
                if (saved) return saved;
            } catch (e) {}
            return "Light"
        }
    );


    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem("theme", theme);
    }, [theme]);

    return { theme, toggle: () => setTheme(t => (t === "Dark" ? "Light" : "Dark")) };
}
