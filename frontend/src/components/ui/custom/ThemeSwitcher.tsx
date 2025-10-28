import { useThemeStore } from "@/stores/useThemeStore";
import { Switch } from "@/components/ui/switch";
import { Sun } from "lucide-react";
import { Moon } from "lucide-react";

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useThemeStore();
  return (
    <div className="flex items-center space-x-2">
      {theme === "light" ? (
        <Sun strokeWidth={2} className="h-5 w-5" />
      ) : (
        <Moon strokeWidth={2} className="h-5 w-5" />
      )}
      <Switch
        id="theme-switch"
        className="cursor-pointer"
        checked={theme === "dark"}
        onCheckedChange={toggleTheme}
      />
    </div>
  );
};

export default ThemeSwitcher;
