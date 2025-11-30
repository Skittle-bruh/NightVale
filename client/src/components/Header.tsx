import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoUrl from "@assets/image_1764512013959.png";

interface HeaderProps {
  projectName?: string;
}

export default function Header({ projectName = "Project" }: HeaderProps) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
    if (!document.documentElement.classList.contains("dark") && !document.documentElement.classList.contains("light")) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle("dark", newIsDark);
  };

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md"
      data-testid="header"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <img
            src={logoUrl}
            alt={`${projectName} logo`}
            className="h-10 w-10 rounded-md object-contain"
            data-testid="img-logo"
          />
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-foreground" data-testid="text-project-name">
              {projectName}
            </span>
            <span className="text-xs text-muted-foreground">Changelog</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleTheme}
            data-testid="button-theme-toggle"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
