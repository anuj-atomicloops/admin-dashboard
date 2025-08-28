import { useTheme } from "@/providers/theme-provider";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("light");
    else {
      setTheme("dark");
    }
  };

  return (
    <div
      onClick={toggleTheme}
      className="flex gap-2  cursor-pointer items-center "
    >
      <p className=" text-xs">{theme === "dark" ? "Light" : "Dark"}</p>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full cursor-pointer"
      >
        {theme === "dark" ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
