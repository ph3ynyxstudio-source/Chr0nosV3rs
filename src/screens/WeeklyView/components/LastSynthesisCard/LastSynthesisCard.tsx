import "./LastSynthesisCard.css";

type LastSynthesisCardProps = {
  projectName: string;
  synthesisDate: string;
  weeklySynthesisStatus: string;
  hasSynthesis: boolean;
  onOpenSynthesis?: () => void;
};

export function LastSynthesisCard({
  projectName,
  synthesisDate,
  weeklySynthesisStatus,
  hasSynthesis,
  onOpenSynthesis,
}: LastSynthesisCardProps) {
  const cardTitle = hasSynthesis
    ? "Synthèse hebdomadaire"
    : "En attente de génération";
  const displayDate = hasSynthesis ? synthesisDate : "Aucune synthèse";
  const displayStatus = hasSynthesis ? weeklySynthesisStatus : "Non générée";

  return (
    <aside
      className={`weekly-side-card weekly-side-card-left ${
        hasSynthesis ? "has-summary" : "is-pending"
      }`}>
      <p className="weekly-card-kicker">Dernière synthèse</p>
      <h2>{cardTitle}</h2>
      <p className="weekly-card-project-name">{projectName}</p>

      <div className="weekly-side-block">
        <span className="weekly-side-label">Date</span>
        <strong>{displayDate}</strong>
      </div>

      <div className="weekly-side-block">
        <span className="weekly-side-label">Statut</span>
        <strong>{displayStatus}</strong>
      </div>

      {!hasSynthesis ? (
        <p className="weekly-side-message">
          Generez une synthese depuis le dashboard lorsqu'une session passee est
          disponible.
        </p>
      ) : null}

      <button
        type="button"
        className="weekly-side-action"
        onClick={onOpenSynthesis}
        disabled={!hasSynthesis}>
        {hasSynthesis ? "Voir la synthese" : "Synthese indisponible"}
      </button>
    </aside>
  );
}
