import "./LastSynthesisCard.css";

type LastSynthesisCardProps = {
  projectName: string;
  synthesisDate: string;
  weeklySynthesisStatus: string;
  onOpenSynthesis?: () => void;
};

export function LastSynthesisCard({
  projectName,
  synthesisDate,
  weeklySynthesisStatus,
  onOpenSynthesis,
}: LastSynthesisCardProps) {
  return (
    <aside className="weekly-side-card weekly-side-card-left">
      <p className="weekly-card-kicker">Dernière synthèse validée</p>
      <h2>Synthèse hebdomadaire</h2>
      <p className="weekly-card-project-name">{projectName}</p>

      <div className="weekly-side-block">
        <span className="weekly-side-label">Date</span>
        <strong>{synthesisDate}</strong>
      </div>

      <div className="weekly-side-block">
        <span className="weekly-side-label">Statut</span>
        <strong>{weeklySynthesisStatus}</strong>
      </div>

      <button
        type="button"
        className="weekly-side-action"
        onClick={onOpenSynthesis}>
        Voir la synthese
      </button>
    </aside>
  );
}
