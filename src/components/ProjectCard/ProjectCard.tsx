import "./ProjectCard.css";

type ProjectCardProps = {
  name: string;
  lastActivity: string;
  progress: number;
  isActive?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
  canDelete?: boolean;
};

export function ProjectCard({
  name,
  lastActivity,
  progress,
  isActive = false,
  onClick,
  onDelete,
  canDelete = true,
}: ProjectCardProps) {
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
      <div className="project-card-header">
        <h3>{name}</h3>
        {canDelete ? (
          <button
            type="button"
            className="project-delete-button"
            onClick={(event) => {
              event.stopPropagation();
              onDelete?.();
            }}
            onKeyDown={(event) => {
              event.stopPropagation();
            }}
            aria-label={`Supprimer ${name}`}>
            Supprimer
          </button>
        ) : null}
      </div>
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

        <svg className="progress-ring" viewBox="0 0 36 36" aria-hidden="true">
          <circle
            cx="18"
            cy="18"
            r="15"
            stroke="var(--bg-card-glow)"
            strokeWidth="4"
            fill="none"
          />
          <circle
            cx="18"
            cy="18"
            r="15"
            stroke={isActive ? "var(--accent-purple)" : "var(--accent-blue)"}
            strokeWidth="4"
            fill="none"
            strokeDasharray="94.2"
            strokeDashoffset={94.2 - (progress / 100) * 94.2}
          />
        </svg>

        <span className="pct-text">{progress}%</span>
      </div>
    </article>
  );
}
