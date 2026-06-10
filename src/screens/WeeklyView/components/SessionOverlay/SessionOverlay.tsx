import { type Project, type WeeklyDay } from "../../../Dashboard/projects";
import { getMockSessionContent } from "../../mockSessions";
import "./SessionOverlay.css";

type SessionOverlayProps = {
  openDays: WeeklyDay[];
  allDays: WeeklyDay[];
  project: Project;
  onCloseAll: () => void;
  onCloseDay: (dayId: string) => void;
  onToggleDay: (dayId: string) => void;
};

export function SessionOverlay({
  openDays,
  allDays,
  project,
  onCloseAll,
  onCloseDay,
  onToggleDay,
}: SessionOverlayProps) {
  if (openDays.length === 0) {
    return null;
  }

  return (
    <div className="session-overlay">
      <div className="session-overlay-backdrop" aria-hidden="true" />

      <button
        type="button"
        className="session-overlay-close-all"
        onClick={onCloseAll}>
        Fermer l'overlay
      </button>

      <div className="session-overlay-mini-days">
        {allDays.map((day) => {
          const isOpen = openDays.some((openDay) => openDay.id === day.id);
          const isDisabled = openDays.length >= 2 && !isOpen;
          const statusClass =
            day.status === "En cours"
              ? "is-current"
              : day.status === "Completee"
                ? "is-complete"
                : "is-pending";

          return (
            <button
              type="button"
              key={day.id}
              className={`session-overlay-mini-day ${statusClass} ${
                isOpen ? "is-open" : ""
              }`}
              onClick={() => onToggleDay(day.id)}
              disabled={isDisabled}
              aria-pressed={isOpen}>
              <span className="session-overlay-mini-label">{day.label}</span>
              <strong>{day.shortDate}</strong>
              <span
                className="session-overlay-mini-indicator"
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>

      <div
        className={`session-overlay-panel ${
          openDays.length === 1 ? "is-single" : "is-dual"
        }`}>
        {openDays.map((day, index) => {
          const content = getMockSessionContent(project, day);
          const accentClass = index === 0 ? "is-cyan" : "is-purple";

          return (
            <article
              key={day.id}
              className={`session-focus-card ${accentClass}`}>
              <header className="session-focus-card-header">
                <div className="session-focus-card-title-group">
                  <span className="session-focus-card-icon" aria-hidden="true">
                    []
                  </span>
                  <div>
                    <h3>{day.label}</h3>
                    <p>{day.date}</p>
                  </div>
                </div>

                <div className="session-focus-card-actions">
                  <span className="session-focus-card-status">{day.status}</span>
                  <button
                    type="button"
                    className="session-focus-card-close"
                    onClick={() => onCloseDay(day.id)}>
                    Fermer
                  </button>
                </div>
              </header>

              <div className="session-focus-card-scroll">
                <section className="session-focus-card-section">
                  <h4>Contexte</h4>
                  <p>{content.context}</p>
                </section>

                <section className="session-focus-card-section">
                  <h4>Realise</h4>
                  <ul>
                    {content.completed.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>

                <section className="session-focus-card-section">
                  <h4>Decouvertes</h4>
                  <ul>
                    {content.discoveries.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>

                <section className="session-focus-card-section">
                  <h4>Blocages</h4>
                  <ul>
                    {content.blockers.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>

                <section className="session-focus-card-section">
                  <h4>Suite</h4>
                  <ul>
                    {content.nextSteps.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>

                <section className="session-focus-card-section session-focus-card-summary">
                  <h4>Resume en une phrase</h4>
                  <p>{content.summary}</p>
                </section>
              </div>
            </article>
          );
        })}
      </div>

      <p className="session-overlay-note">
        Vous pouvez garder jusqu'a 2 sessions ouvertes et fermer chaque panneau
        independamment.
      </p>
    </div>
  );
}
