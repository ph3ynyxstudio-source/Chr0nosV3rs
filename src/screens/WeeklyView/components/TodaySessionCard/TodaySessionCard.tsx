import { useState } from "react";
import "./TodaySessionCard.css";

const DAILY_SESSION_PROMPT = `Tu agis comme le module daily prompt ⌛↻hr0nosV3rs

Analyse l'intégralité de la conversation et produis une synthèse de session concise et factuelle.

Règles :

- Décrire ce qui s'est réellement passé pendant la session.
- Ne pas inventer d'éléments absents de la conversation.
- Ne pas transformer des idées en décisions validées.
- Distinguer clairement les réalisations des réflexions.
- Écrire dans un style simple, direct et relisible plusieurs mois plus tard.
- Prioriser les informations utiles à la compréhension de l'évolution du travail.

Format obligatoire :

# 📌 Contexte

Résumé du sujet principal de la session.

# ✅ Réalisé

Liste des éléments réellement accomplis ou clarifiés.

# 💡 Découvertes

Idées, compréhensions, constats ou pistes apparues durant la session.

# 🚧 Blocages

Difficultés, incertitudes ou questions restées ouvertes.

# ➡️ Suite

Prochaines actions, pistes d'exploration ou éléments à reprendre plus tard.

# 🧭 Résumé en une phrase

Une phrase résumant l'essentiel de la session.
`;

type TodaySessionCardProps = {
  projectName: string;
  currentDayLabel: string;
  currentDayDate: string;
  projectDescription?: string;
  onOpenSession?: () => void;
  onOpenRawSessions?: () => void;
};

export function TodaySessionCard({
  projectName,
  currentDayLabel,
  currentDayDate,
  projectDescription,
  onOpenSession,
  onOpenRawSessions,
}: TodaySessionCardProps) {
  const [hasCopiedPrompt, setHasCopiedPrompt] = useState(false);
  const displayedDescription =
    projectDescription?.trim() || "Projet local suivi par sessions hebdomadaires.";

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(DAILY_SESSION_PROMPT);
      setHasCopiedPrompt(true);
      window.setTimeout(() => setHasCopiedPrompt(false), 1800);
    } catch (error) {
      window.alert(`Copie du prompt impossible : ${String(error)}`);
    }
  };

  return (
    <aside className="weekly-side-card weekly-side-card-right">
      <p className="weekly-card-kicker weekly-card-kicker-purple">
        Session du jour
      </p>
      <h2>{projectName}</h2>

      <div className="weekly-side-block">
        <span className="weekly-side-label">Aujourd'hui</span>
        <strong>
          {currentDayLabel} {currentDayDate}
        </strong>
      </div>

      <div className="weekly-side-block">
        <span className="weekly-side-label">Description du projet</span>
        <p>{displayedDescription}</p>
      </div>

      <div className="weekly-side-actions">
        <button
          type="button"
          className="weekly-side-action weekly-side-action-purple"
          onClick={onOpenSession}>
          Ouvrir la session
        </button>

        <button
          type="button"
          className="weekly-side-action weekly-side-action-secondary"
          onClick={onOpenRawSessions}>
          Ouvrir le dossier raw
        </button>

        <button
          type="button"
          className="weekly-side-action weekly-side-action-secondary"
          onClick={() => void handleCopyPrompt()}>
          {hasCopiedPrompt ? "Prompt copié" : "Copier prompt session"}
        </button>
      </div>
    </aside>
  );
}
