import React from "react";
// AJOUT 1 : On importe ton dictionnaire de couleurs
import { DESIGN_TOKENS } from "../theme/design_tokens";

interface ProjectCardProps {
  name: string;
  lastActivity: string;
  progress: number;
  isActive?: boolean;
  onClick?: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  name,
  lastActivity,
  progress,
  isActive = false,
  onClick,
}) => {
  const dashOffset = 75.4 - (progress / 100) * 75.4;
  const classNames = ["project-card", isActive ? "active" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={classNames} onClick={onClick} key={name}>
      <h3>{name}</h3>
      <small>Dernière activité</small>
      <p>{lastActivity}</p>
      <div className="progress-container">
        <svg width="28" height="28" viewBox="0 0 28 28">
          <circle
            cx="14"
            cy="14"
            r="12"
            stroke="var(--bg-card-glow)" // On garde la variable CSS ici pour l'instant
            strokeWidth="3"
            fill="none"
          />
          {/* AJOUT 2 : On utilise le dictionnaire TS pour la couleur bleue */}
          <circle
            cx="14"
            cy="14"
            r="12"
            stroke={
              isActive
                ? DESIGN_TOKENS.colors.accent.purple
                : DESIGN_TOKENS.colors.accent.blue
            }
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
};
