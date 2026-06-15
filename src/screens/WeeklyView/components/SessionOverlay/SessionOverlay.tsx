import { useEffect, useState } from "react";
import { type WeeklyDay } from "../../../Dashboard/projects";
import calendarNeonIcon from "../../../../assets/icons/neon/calendar-neon.svg?raw";
import closeNeonIcon from "../../../../assets/icons/neon/close-neon.svg?raw";
import "./SessionOverlay.css";

type SessionOverlayProps = {
  projectId: string;
  openDays: WeeklyDay[];
  allDays: WeeklyDay[];
  onCloseAll: () => void;
  onCloseDay: (dayId: string) => void;
  onSaveDay: (dayId: string, content: string) => Promise<void>;
  onToggleDay: (dayId: string) => void;
};

const getStatusLabel = (status: WeeklyDay["status"], isMissed = false) => {
  if (isMissed) {
    return "Non complétée";
  }

  if (status === "À créer") {
    return "Créer session";
  }

  if (status === "À faire") {
    return "À venir";
  }

  return status;
};

function NeonIcon({
  className,
  svg,
}: {
  className: string;
  svg: string;
}) {
  return (
    <span
      className={className}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

export function SessionOverlay({
  projectId,
  openDays,
  allDays,
  onCloseAll,
  onCloseDay,
  onSaveDay,
  onToggleDay,
}: SessionOverlayProps) {
  const [draftsByDayId, setDraftsByDayId] = useState<Record<string, string>>(
    {},
  );
  const [savingDayId, setSavingDayId] = useState<string | null>(null);
  const openDayDraftKey = openDays
    .map((day) => `${day.id}:${day.rawContent ?? ""}`)
    .join("|");

  useEffect(() => {
    setDraftsByDayId((currentDrafts) =>
      Object.fromEntries(
        openDays.map((day) => [
          day.id,
          currentDrafts[day.id] ?? day.rawContent ?? "",
        ]),
      ),
    );
  }, [openDayDraftKey]);

  if (openDays.length === 0) {
    return null;
  }

  const handleDraftChange = (dayId: string, value: string) => {
    setDraftsByDayId((currentDrafts) => ({
      ...currentDrafts,
      [dayId]: value,
    }));
  };

  const handleSave = async (day: WeeklyDay) => {
    if (!day.rawDateId) {
      window.alert("Aucun fichier raw existant pour cette journee.");
      return;
    }

    const draft = draftsByDayId[day.id] ?? "";
    setSavingDayId(day.id);

    try {
      await onSaveDay(day.rawDateId, draft);
    } catch (error) {
      window.alert(`Sauvegarde impossible : ${String(error)}`);
    } finally {
      setSavingDayId(null);
    }
  };

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
              : day.status === "Complétée"
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
          const accentClass = index === 0 ? "is-cyan" : "is-purple";
          const draft = draftsByDayId[day.id] ?? day.rawContent ?? "";
          const isSaving = savingDayId === day.id;
          const canSave = Boolean(day.rawDateId) && !isSaving;
          const statusLabel = getStatusLabel(day.status, day.isMissed);

          return (
            <article
              key={day.id}
              className={`session-focus-card ${accentClass}`}>
              <header className="session-focus-card-header">
                <div className="session-focus-card-title-group">
                  <span className="session-focus-card-icon" aria-hidden="true">
                    <NeonIcon
                      className="session-focus-card-svg-icon"
                      svg={calendarNeonIcon}
                    />
                  </span>
                  <div>
                    <h3>{day.label}</h3>
                    <p>{day.date}</p>
                  </div>
                </div>

                <div className="session-focus-card-actions">
                  <span className="session-focus-card-status">
                    {statusLabel}
                  </span>
                  <button
                    type="button"
                    className="session-focus-card-save"
                    onClick={() => void handleSave(day)}
                    disabled={!canSave}>
                    {isSaving ? "Enregistrement..." : "Enregistrer"}
                  </button>
                  <button
                    type="button"
                    className="session-focus-card-close"
                    onClick={() => onCloseDay(day.id)}
                    aria-label="Fermer la session">
                    <NeonIcon
                      className="session-focus-card-close-icon"
                      svg={closeNeonIcon}
                    />
                  </button>
                </div>
              </header>

              <div className="session-focus-card-scroll">
                {day.rawDateId ? (
                  <section className="session-focus-card-section">
                    <h4>{day.rawFileName ?? "Session markdown"}</h4>
                    <textarea
                      className="session-focus-card-markdown-editor"
                      value={draft}
                      onChange={(event) =>
                        handleDraftChange(day.id, event.target.value)
                      }
                      aria-label={`Markdown brut ${projectId} ${day.date}`}
                    />
                  </section>
                ) : (
                  <section className="session-focus-card-section session-focus-card-summary">
                    <h4>Session vide</h4>
                    <p>
                      Aucun fichier raw markdown n'est disponible pour cette
                      journee.
                    </p>
                  </section>
                )}
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
