import "./NewProjectOverlay.css";

type NewProjectOverlayProps = {
  isOpen: boolean;
  projectName: string;
  onProjectNameChange: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
};

export function NewProjectOverlay({
  isOpen,
  projectName,
  onProjectNameChange,
  onCancel,
  onConfirm,
}: NewProjectOverlayProps) {
  if (!isOpen) {
    return null;
  }

  const isConfirmDisabled = projectName.trim().length === 0;

  return (
    <div className="new-project-overlay">
      <div className="new-project-overlay-backdrop" aria-hidden="true" />

      <div
        className="new-project-overlay-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-project-overlay-title">
        <p className="new-project-overlay-kicker">Nouveau projet</p>
        <h2 id="new-project-overlay-title">Definir le nom du projet</h2>
        <p className="new-project-overlay-copy">
          Choisissez un nom simple pour creer le projet dans le MVP local.
        </p>

        <label className="new-project-overlay-field">
          <span>Nom du projet</span>
          <input
            type="text"
            value={projectName}
            onChange={(event) => onProjectNameChange(event.target.value)}
            placeholder="Nom du projet"
            autoFocus
          />
        </label>

        <div className="new-project-overlay-actions">
          <button type="button" onClick={onCancel}>
            Annuler
          </button>
          <button
            type="button"
            className="is-primary"
            onClick={onConfirm}
            disabled={isConfirmDisabled}>
            Creer le projet
          </button>
        </div>
      </div>
    </div>
  );
}
