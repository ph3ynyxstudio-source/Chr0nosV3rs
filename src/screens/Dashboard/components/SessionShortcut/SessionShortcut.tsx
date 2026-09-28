import { useEffect, useState } from "react";
import { DAILY_SESSION_PROMPT } from "../../../../shared/dailySessionPrompt";
import "./SessionShortcut.css";

type SessionShortcutProps = {
  projectName: string | null;
  disabled: boolean;
  onOpenWeeklyView: () => void;
  lastSession: { label: string; date: string; content: string } | null;
  today: { label: string; date: string; initialContent: string };
  onSaveToday: (content: string) => Promise<void>;
};

export function SessionShortcut({
  projectName,
  disabled,
  onOpenWeeklyView,
  lastSession,
  today,
  onSaveToday,
}: SessionShortcutProps) {
  const [hasCopiedPrompt, setHasCopiedPrompt] = useState(false);
  const [hasCopiedLastSession, setHasCopiedLastSession] = useState(false);
  const [draft, setDraft] = useState(today.initialContent);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setDraft(today.initialContent);
  }, [today.date, today.initialContent]);

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(DAILY_SESSION_PROMPT);
      setHasCopiedPrompt(true);
      window.setTimeout(() => setHasCopiedPrompt(false), 1800);
    } catch (error) {
      window.alert(`Copie du prompt impossible : ${String(error)}`);
    }
  };

  const handleCopyLastSession = async () => {
    if (!lastSession) {
      return;
    }

    try {
      await navigator.clipboard.writeText(lastSession.content);
      setHasCopiedLastSession(true);
      window.setTimeout(() => setHasCopiedLastSession(false), 1800);
    } catch (error) {
      window.alert(`Copie de la session impossible : ${String(error)}`);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      await onSaveToday(draft);
    } catch (error) {
      window.alert(`Sauvegarde impossible : ${String(error)}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section
      className={`session-shortcut ${disabled ? "is-disabled" : ""}`}
      aria-disabled={disabled}>
      <header className="session-shortcut-header">
        <h2>{projectName ?? "Aucun projet sélectionné"}</h2>
        <button
          type="button"
          className="session-shortcut-open-weekly"
          onClick={onOpenWeeklyView}
          disabled={disabled}>
          Ouvrir la vue hebdomadaire <span aria-hidden="true">→</span>
        </button>
      </header>

      <button
        type="button"
        className="session-shortcut-prompt-badge"
        onClick={() => void handleCopyPrompt()}
        disabled={disabled}>
        {hasCopiedPrompt ? "Prompt copié" : "Terminé Aujourd'hui ?"}
      </button>

      <div className="session-shortcut-cards">
        <article className="session-shortcut-card">
          <header className="session-shortcut-card-header">
            <h3>{lastSession?.label ?? "Dernière session"}</h3>
            <span className="session-shortcut-badge">Dernière session</span>
          </header>
          <p className="session-shortcut-card-date">
            {lastSession?.date ?? "—"}
          </p>

          <div className="session-shortcut-card-body">
            {lastSession ? (
              <p className="session-shortcut-readonly-content">
                {lastSession.content}
              </p>
            ) : (
              <p className="session-shortcut-empty">
                Aucune session enregistrée.
              </p>
            )}
          </div>

          <button
            type="button"
            className="session-shortcut-copy-session"
            onClick={() => void handleCopyLastSession()}
            disabled={!lastSession}>
            {hasCopiedLastSession ? "Session copiée" : "Copier la session ?"}
          </button>
        </article>

        <article className="session-shortcut-card">
          <header className="session-shortcut-card-header">
            <h3>{today.label}</h3>
            <span className="session-shortcut-badge">Aujourd'hui</span>
          </header>
          <p className="session-shortcut-card-date">{today.date}</p>

          <div className="session-shortcut-card-body">
            <textarea
              className="session-shortcut-editor"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              disabled={disabled}
              placeholder="Collez ou écrivez le contenu de fin de session ici."
              aria-label={`Session du jour ${today.date}`}
            />
          </div>

          <button
            type="button"
            className="session-shortcut-save"
            onClick={() => void handleSave()}
            disabled={disabled || isSaving}>
            {isSaving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </article>
      </div>
    </section>
  );
}
