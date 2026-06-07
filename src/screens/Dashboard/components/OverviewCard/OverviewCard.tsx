import "./OverviewCard.css";

type OverviewCardProps = {
  projectName: string;
  activeWeek: string;
};

export function OverviewCard({ projectName, activeWeek }: OverviewCardProps) {
  return (
    <article className="overview-card">
      <h2>Vue globale des projets</h2>
      <p>
        {projectName} est selectionne pour {activeWeek.toLowerCase()}.
      </p>
      <button type="button">Voir tous les projets</button>
    </article>
  );
}
