import calendarNeonIcon from "../../../../assets/icons/neon/calendar-neon.svg?raw";
import closeNeonIcon from "../../../../assets/icons/neon/close-neon.svg?raw";
import { type WeeklySummary } from "../../projects";
import "../../../WeeklyView/components/SessionOverlay/SessionOverlay.css";
import "./WeeklySummaryOverlay.css";

type WeeklySummaryOverlayProps = {
  isOpen: boolean;
  weeklySummary?: WeeklySummary;
  status: string;
  onClose: () => void;
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

function NeonIcon({ className, svg }: { className: string; svg: string }) {
  return (
    <span
      className={className}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

const getPartialSummaryLabel = (weeklySummary: WeeklySummary) => {
  const sessionCount = weeklySummary.meta.session_count;
  const expectedSessionCount = weeklySummary.meta.expected_session_count ?? 7;
  const isPartial =
    weeklySummary.meta.is_partial ?? sessionCount < expectedSessionCount;

  if (!isPartial) {
    return null;
  }

  return `Synthèse partielle — ${sessionCount} / ${expectedSessionCount} sessions utilisées`;
};

const SummaryList = ({
  items,
  emptyLabel = "Aucun élément renseigné.",
}: {
  items: string[];
  emptyLabel?: string;
}) => {
  if (items.length === 0) {
    return <p>{emptyLabel}</p>;
  }

  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
};

export function WeeklySummaryOverlay({
  isOpen,
  weeklySummary,
  status,
  onClose,
}: WeeklySummaryOverlayProps) {
  if (!isOpen || !weeklySummary) {
    return null;
  }

  const progressionItems = weeklySummary.progression?.length
    ? weeklySummary.progression
    : weeklySummary.achievements;
  const resolutionItems = weeklySummary.resolutions ?? [];
  const learningItems = weeklySummary.learnings ?? [];
  const nextItems = weeklySummary.next?.length
    ? weeklySummary.next
    : weeklySummary.notes;
  const partialSummaryLabel = getPartialSummaryLabel(weeklySummary);

  return (
    <div className="session-overlay weekly-summary-overlay">
      <div className="session-overlay-backdrop" aria-hidden="true" />

      <button
        type="button"
        className="session-overlay-close-all"
        onClick={onClose}>
        Fermer
      </button>

      <div className="session-overlay-panel is-single weekly-summary-overlay-panel">
        <article className="session-focus-card is-cyan weekly-summary-focus-card">
          <header className="session-focus-card-header">
            <div className="session-focus-card-title-group">
              <span className="session-focus-card-icon" aria-hidden="true">
                <NeonIcon
                  className="session-focus-card-svg-icon"
                  svg={calendarNeonIcon}
                />
              </span>
              <div>
                <h3>Synthèse hebdomadaire</h3>
                <p>{formatSummaryDate(weeklySummary.meta.created_at)}</p>
                {partialSummaryLabel ? (
                  <p className="weekly-summary-partial">
                    {partialSummaryLabel}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="session-focus-card-actions">
              <span className="session-focus-card-status">{status}</span>
              <button
                type="button"
                className="session-focus-card-close"
                onClick={onClose}
                aria-label="Fermer la synthèse">
                <NeonIcon
                  className="session-focus-card-close-icon"
                  svg={closeNeonIcon}
                />
              </button>
            </div>
          </header>

          <div className="session-focus-card-scroll">
            <section className="session-focus-card-section session-focus-card-summary">
              <h4>Résumé</h4>
              <p>{weeklySummary.summary}</p>
            </section>

            <section className="session-focus-card-section">
              <h4>Progression</h4>
              <SummaryList
                items={progressionItems}
                emptyLabel="Aucune progression renseignée."
              />
            </section>

            <section className="session-focus-card-section">
              <h4>Blocages</h4>
              <SummaryList
                items={weeklySummary.blockers}
                emptyLabel="Aucun blocage renseigné."
              />
            </section>

            <section className="session-focus-card-section">
              <h4>Résolutions</h4>
              <SummaryList
                items={resolutionItems}
                emptyLabel="Aucune résolution renseignée."
              />
            </section>

            <section className="session-focus-card-section">
              <h4>Apprentissages</h4>
              <SummaryList
                items={learningItems}
                emptyLabel="Aucun apprentissage renseigné."
              />
            </section>

            <section className="session-focus-card-section">
              <h4>Suite</h4>
              <SummaryList items={nextItems} emptyLabel="Aucune suite renseignée." />
            </section>
          </div>
        </article>
      </div>
    </div>
  );
}
