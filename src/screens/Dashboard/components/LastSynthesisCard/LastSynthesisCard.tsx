import { type WeeklySummary } from "../../projects";
import "./LastSynthesisCard.css";

type LastSynthesisCardProps = {
  synthesisTitle: string;
  weeklySynthesisStatus: string;
  weeklySummary?: WeeklySummary;
  canGenerateWeeklySummary: boolean;
  isGenerating: boolean;
  onGenerateWeeklySummary: () => void;
  onOpenWeeklySummary: () => void;
};

const formatSummaryDate = (value: string) => {
  const [datePart] = value.split("T");
  const [year, month, day] = datePart.split("-").map(Number);

  if (!year || !month || !day) {
    return value;
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
};

const getPartialSummaryLabel = (weeklySummary?: WeeklySummary) => {
  if (!weeklySummary) {
    return null;
  }

  const sessionCount = weeklySummary.meta.session_count;
  const expectedSessionCount = weeklySummary.meta.expected_session_count ?? 7;
  const isPartial =
    weeklySummary.meta.is_partial ?? sessionCount < expectedSessionCount;

  if (!isPartial) {
    return null;
  }

  return `Synthèse partielle — ${sessionCount} / ${expectedSessionCount} sessions utilisées`;
};

export function LastSynthesisCard({
  synthesisTitle,
  weeklySynthesisStatus,
  weeklySummary,
  canGenerateWeeklySummary,
  isGenerating,
  onGenerateWeeklySummary,
  onOpenWeeklySummary,
}: LastSynthesisCardProps) {
  const hasSummary = Boolean(weeklySummary);
  const cardTitle = hasSummary ? synthesisTitle : "En attente de génération";
  const actionLabel = hasSummary
    ? "Ouvrir"
    : isGenerating
      ? "Génération..."
      : "Générer la synthèse";
  const generatedDate = weeklySummary
    ? formatSummaryDate(weeklySummary.meta.created_at)
    : null;
  const partialSummaryLabel = getPartialSummaryLabel(weeklySummary);

  return (
    <article
      className={`last-synthesis-card ${
        hasSummary ? "has-summary" : "is-pending"
      }`}>
      <div className="last-synthesis-card-header">
        <h2>Dernière synthèse</h2>
        <span>»</span>
      </div>
      <strong>{cardTitle}</strong>
      <div className="last-synthesis-card-footer">
        <div className="last-synthesis-card-state">
          {generatedDate ? <small>{generatedDate}</small> : null}
          {hasSummary ? (
            <span className="last-synthesis-card-status">
              {weeklySynthesisStatus}
            </span>
          ) : !canGenerateWeeklySummary ? (
            <p className="last-synthesis-card-message">
              Ajoutez au moins une session passée pour générer.
            </p>
          ) : null}
          {partialSummaryLabel ? (
            <p className="last-synthesis-card-partial">
              {partialSummaryLabel}
            </p>
          ) : null}
        </div>
        <button
          className="last-synthesis-card-action"
          type="button"
          onClick={hasSummary ? onOpenWeeklySummary : onGenerateWeeklySummary}
          disabled={!hasSummary && isGenerating}>
          {actionLabel}
        </button>
      </div>
    </article>
  );
}
