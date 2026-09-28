import "./ThemeToggle.css";

type ThemeToggleProps = {
  theme: "sombre" | "aube";
  onToggleTheme: () => void;
};

export function ThemeToggle({ theme, onToggleTheme }: ThemeToggleProps) {
  const isAube = theme === "aube";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggleTheme}
      aria-label={isAube ? "Passer au thème sombre" : "Passer au thème Aube"}>
      {isAube ? "Aube" : "Sombre"}
    </button>
  );
}
