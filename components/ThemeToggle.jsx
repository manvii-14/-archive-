"use client";
// Icons import
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
// ShadCN imports
import { Button } from "@/components/ui/button";

// ThemeToggle Component
export default function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    return (
        <Button
            className="rounded-full"
            variant="outline"
            size="icon"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
            title={`Switch to ${isDark ? "light" : "dark"} theme`}
        >
            {isDark ? <Sun className="h-[1rem] w-[1rem]" /> : <Moon className="h-[1rem] w-[1rem]" />}
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
