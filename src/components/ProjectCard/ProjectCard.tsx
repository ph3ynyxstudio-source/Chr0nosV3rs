import { type MouseEvent } from "react";
import editNeonIcon from "../../assets/icons/neon/edit-neon.svg?raw";
import "./ProjectCard.css";

type ProjectCardProps = {
  name: string;
  lastActivity: string;
  isActive?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  canDelete?: boolean;
};

function NeonIcon({
  className,
  svg,
}: {
  className: string;
  svg: string;
}) {
  return (
    <span
      className={className}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

export function ProjectCard({
  name,
  lastActivity,
  isActive = false,
  onClick,
  onDelete,
  onEdit,
  canDelete = true,
}: ProjectCardProps) {
  const className = ["project-card", isActive ? "active" : ""]
    .filter(Boolean)
    .join(" ");

  const handleEditOpen = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onEdit?.();
  };

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
        <div className="project-card-actions">
          <button
            type="button"
            className="project-edit-button"
            onClick={handleEditOpen}
            onKeyDown={(event) => {
              event.stopPropagation();
            }}
            aria-label={`Modifier ${name}`}>
            <NeonIcon className="project-edit-icon" svg={editNeonIcon} />
          </button>
        </div>
      </div>
      <small>Dernière activité</small>
      <p>{lastActivity}</p>

      {canDelete ? (
        <div className="project-card-footer">
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
        </div>
      ) : null}
    </article>
  );
}
