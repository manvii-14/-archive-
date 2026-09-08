"use client";
// Icons import
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
// ShadCN imports
import { Button } from "@/components/ui/button";

// ThemeToggle Component
export default function ThemeToggle() {
    const { setTheme } = useTheme();

    return (
        <Button
            className="rounded-full"
            variant="outline"
            size="icon"
            onClick={() => setTheme(document.documentElement.classList.contains("dark") ? "light" : "dark")}
            aria-label="Toggle theme"
            title="Toggle theme"
        >
            <Sun className="hidden h-[1rem] w-[1rem] dark:block" />
            <Moon className="h-[1rem] w-[1rem] dark:hidden" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
