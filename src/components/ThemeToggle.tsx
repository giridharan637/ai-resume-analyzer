"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-9 w-9" />; // Placeholder to avoid layout shift
  }

  return (
    <Button
      className="rounded-full hover:bg-foreground/5 transition-colors"
      variant="ghost"
      size="icon"
      onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-500 ease-in-out dark:-rotate-90 dark:scale-0 text-amber-500" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-500 ease-in-out dark:rotate-0 dark:scale-100 text-cyan-400" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
