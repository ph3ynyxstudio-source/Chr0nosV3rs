import "./OverviewCard.css";

type OverviewCardProps = {
  projectName: string | null;
  activeWeek: string | null;
  onOpenWeeklyView: () => void;
};

export function OverviewCard({
  projectName,
  activeWeek,
  onOpenWeeklyView,
}: OverviewCardProps) {
  const hasSelectedProject = Boolean(projectName && activeWeek);

  return (
    <article className="overview-card">
      <h2>Vue hebdomadaire du projet</h2>
      <p>
        {hasSelectedProject
          ? projectName
          : "Selectionnez un projet pour ouvrir sa semaine active."}
      </p>
      <button
        type="button"
        onClick={onOpenWeeklyView}
        disabled={!hasSelectedProject}>
        {hasSelectedProject ? "Ouvrir la semaine" : "Aucun projet selectionne"}
      </button>
    </article>
  );
}
