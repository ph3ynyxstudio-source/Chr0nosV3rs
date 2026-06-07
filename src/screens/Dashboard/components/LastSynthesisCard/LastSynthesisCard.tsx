import "./LastSynthesisCard.css";

type LastSynthesisCardProps = {
  synthesisTitle: string;
  synthesisDate: string;
  weeklySynthesisStatus: string;
  synthesisActionLabel: string;
};

export function LastSynthesisCard({
  synthesisTitle,
  synthesisDate,
  weeklySynthesisStatus,
  synthesisActionLabel,
}: LastSynthesisCardProps) {
  return (
    <article className="last-synthesis-card">
      <div className="last-synthesis-card-header">
        <h2>Dernière synthèse</h2>
        <span>»</span>
      </div>
      <strong>{synthesisTitle}</strong>
      <small>{synthesisDate}</small>
      <span className="last-synthesis-card-status">{weeklySynthesisStatus}</span>
      <button className="last-synthesis-card-action" type="button">
        {synthesisActionLabel}
      </button>
    </article>
  );
}
