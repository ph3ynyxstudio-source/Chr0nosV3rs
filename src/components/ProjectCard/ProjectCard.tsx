import "./ProjectCard.css";

type ProjectCardProps = {
  name: string;
  lastActivity: string;
  progress: number;
  isActive?: boolean;
  onClick?: () => void;
};

export function ProjectCard({
  name,
  lastActivity,
  progress,
  isActive = false,
  onClick,
}: ProjectCardProps) {
  const dashOffset = 75.4 - (progress / 100) * 75.4;
  const className = ["project-card", isActive ? "active" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <article
      className={className}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick?.();
        }
      }}
      aria-pressed={isActive}>
      <h3>{name}</h3>
      <small>Dernière activité</small>
      <p>{lastActivity}</p>

      <div className="project-progress-meta">
        <span>Progression</span>
      </div>

      <div
        className="progress-container"
        aria-label={`Progression ${progress}%`}>
        <div className="progress-line" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>

        <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
          <circle
            cx="14"
            cy="14"
            r="12"
            stroke="var(--bg-card-glow)"
            strokeWidth="3"
            fill="none"
          />
          <circle
            cx="14"
            cy="14"
            r="12"
            stroke={isActive ? "var(--accent-purple)" : "var(--accent-blue)"}
            strokeWidth="3"
            fill="none"
            strokeDasharray="75.4"
            strokeDashoffset={dashOffset}
          />
        </svg>

        <span className="pct-text">{progress}%</span>
      </div>
    </article>
  );
}
