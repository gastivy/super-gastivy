import { IconMoon, IconSun } from "@tabler/icons-react";

import { useTheme } from "@hooks/useTheme";
import { cn } from "@libs/classnames";

interface ThemeToggleProps {
  className?: string;
  /** Show label text next to the icon */
  showLabel?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className,
  showLabel = false,
}) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "flex items-center gap-2 cursor-pointer",
        "px-3 py-2 rounded-lg",
        "hover:bg-zinc-200 dark:hover:bg-zinc-800",
        "text-slate-700 dark:text-slate-400",
        "transition-colors duration-200",
        className
      )}
      onClick={toggleTheme}
    >
      {isDark ? (
        <IconSun size={20} className="text-brand-400" />
      ) : (
        <IconMoon size={20} />
      )}
      {showLabel && (
        <span className="text-sm">{isDark ? "Light Mode" : "Dark Mode"}</span>
      )}
    </button>
  );
};

export default ThemeToggle;
