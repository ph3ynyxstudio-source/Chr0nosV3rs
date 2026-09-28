import "./NewProjectOverlay.css";

type NewProjectOverlayProps = {
  isOpen: boolean;
  mode?: "create" | "edit";
  projectName: string;
  projectTargetWeeks: string;
  projectDescription: string;
  onProjectNameChange: (value: string) => void;
  onProjectTargetWeeksChange: (value: string) => void;
  onProjectDescriptionChange: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
};

export function NewProjectOverlay({
  isOpen,
  mode = "create",
  projectName,
  projectTargetWeeks,
  projectDescription,
  onProjectNameChange,
  onProjectTargetWeeksChange,
  onProjectDescriptionChange,
  onCancel,
  onConfirm,
}: NewProjectOverlayProps) {
  if (!isOpen) {
    return null;
  }

  const isConfirmDisabled = projectName.trim().length === 0;
  const isEditMode = mode === "edit";

  return (
    <div className="new-project-overlay">
      <div className="new-project-overlay-backdrop" aria-hidden="true" />

      <div
        className="new-project-overlay-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-project-overlay-title">
        <p className="new-project-overlay-kicker" id="new-project-overlay-title">
          {isEditMode ? "Modifier le nom du projet" : "Nouveau projet"}
        </p>
        {isEditMode ? null : (
          <>
            <h2>Définir le nom du projet</h2>
            <p className="new-project-overlay-copy">
              Choisissez un nom simple pour créer le projet dans le MVP local.
            </p>
          </>
        )}

        <label className="new-project-overlay-field">
          {isEditMode ? null : <span>Nom du projet</span>}
          <input
            type="text"
            value={projectName}
            onChange={(event) => onProjectNameChange(event.target.value)}
            placeholder="Nom du projet"
            aria-label={isEditMode ? "Nom du projet" : undefined}
            autoFocus
          />
        </label>

        {isEditMode ? null : (
          <>
            <label className="new-project-overlay-field">
              <span>Objectif du projet en semaines</span>
              <input
                type="number"
                min="1"
                value={projectTargetWeeks}
                onChange={(event) =>
                  onProjectTargetWeeksChange(event.target.value)
                }
                placeholder="12"
              />
            </label>

            <label className="new-project-overlay-field">
              <span>Description courte du projet</span>
              <textarea
                value={projectDescription}
                onChange={(event) =>
                  onProjectDescriptionChange(event.target.value)
                }
                placeholder="Projet local suivi par sessions hebdomadaires."
                rows={3}
              />
            </label>
          </>
        )}

        <div className="new-project-overlay-actions">
          <button type="button" onClick={onCancel}>
            Annuler
          </button>
          <button
            type="button"
            className="is-primary"
            onClick={onConfirm}
            disabled={isConfirmDisabled}>
            {isEditMode ? "Enregistrer" : "Créer le projet"}
          </button>
        </div>
      </div>
    </div>
  );
}
