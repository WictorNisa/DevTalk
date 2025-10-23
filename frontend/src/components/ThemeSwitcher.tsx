import { useThemeStore } from "@/stores/useThemeStore";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Sun } from "lucide-react";
import { Moon } from "lucide-react";

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useThemeStore();
  return (
    <div className="flex items-center space-x-2">
      {theme === "light" ? (
        <Sun strokeWidth={1} className="h-5 w-5 text-white" />
      ) : (
        <Moon strokeWidth={1} className="h-5 w-5 text-white" />
      )}
      <Switch
        id="theme-switch"
        checked={theme === "dark"}
        onCheckedChange={toggleTheme}
      />
    </div>
  );
};

export default ThemeSwitcher;
