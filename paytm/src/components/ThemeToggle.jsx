"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <button
            onClick={() =>
                setTheme(theme === "dark" ? "light" : "dark")
            }
            className="
            rounded-lg
            px-4
            py-2
            bg-white
            text-blue-600
            hover:bg-gray-100
            dark:bg-slate-700
            dark:text-white
            dark:hover:bg-slate-600
            transition
            "
        >
            {theme === "dark" ? "☀️" : "🌙"}
        </button>
    );
}