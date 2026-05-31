// Import du fichier CSS du composant
import "./ProjectCard.css";
// Import des tokens de design pour les couleurs
import { DESIGN_TOKENS } from "../theme/design_tokens";

// Définition des propriétés attendues par le composant
interface ProjectCardProps {
  name: string;
  lastActivity: string;
  progress: number;
  isActive: boolean;
  onClick: () => void;
}

export function ProjectCard({
  name,
  lastActivity,
  progress,
  isActive,
  onClick,
}: ProjectCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyPress={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      className={`project-card ${isActive ? "is-active" : ""}`}
      style={{
        // Couleur de fond provenant des tokens de design
        backgroundColor: DESIGN_TOKENS.colors.bg.card,
      }}>
      <h3>{name}</h3>
      <span className="activity">Dernière activité : {lastActivity}</span>

      <div className="progress-container">
        <div
          className="radial-loader"
          style={{ borderColor: DESIGN_TOKENS.colors.accent.blue }}></div>
        <span>{progress}%</span>
      </div>
    </div>
  );
}
