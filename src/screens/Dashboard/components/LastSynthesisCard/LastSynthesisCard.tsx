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

  return (
    <article className={`last-synthesis-card ${hasSummary ? "has-summary" : ""}`}>
      <div className="last-synthesis-card-header">
        <h2>Dernière synthèse</h2>
        <span>»</span>
      </div>
      <strong>{cardTitle}</strong>
      {generatedDate ? <small>{generatedDate}</small> : null}
      {hasSummary ? (
        <span className="last-synthesis-card-status">
          {weeklySynthesisStatus}
        </span>
      ) : !canGenerateWeeklySummary ? (
        <p className="last-synthesis-card-message">
          Synthèse disponible lorsque la semaine précédente est complète
        </p>
      ) : null}
      <button
        className="last-synthesis-card-action"
        type="button"
        onClick={hasSummary ? onOpenWeeklySummary : onGenerateWeeklySummary}
        disabled={!hasSummary && (!canGenerateWeeklySummary || isGenerating)}>
        {actionLabel}
      </button>
    </article>
  );
}
