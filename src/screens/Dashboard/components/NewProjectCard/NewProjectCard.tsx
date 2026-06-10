import "./NewProjectCard.css";

type NewProjectCardProps = {
  onClick?: () => void;
};

export function NewProjectCard({ onClick }: NewProjectCardProps) {
  return (
    <article
      className="new-project-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick?.();
        }
      }}>
      <span>＋</span>
      <h3>Nouveau projet</h3>
      <p>Créer un nouveau projet</p>
    </article>
  );
}
