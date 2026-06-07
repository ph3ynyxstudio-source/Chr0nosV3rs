import "./StatusCard.css";

type StatusCardProps = {
  activeWeek: string;
  completedDays: number;
  weekCompletionLabel: string;
  weekProgress: number;
};

export function StatusCard({
  activeWeek,
  completedDays,
  weekCompletionLabel,
  weekProgress,
}: StatusCardProps) {
  return (
    <article className="status-card">
      <div className="status-card-header">
        <h2>Statut actuel</h2>
        <span>›</span>
      </div>
      <div className="status-card-week-status">
        <div className="status-card-ring">{completedDays}/7</div>
        <div>
          <strong>{activeWeek}</strong>
          <small>{weekCompletionLabel}</small>
        </div>
      </div>
      <div className="status-card-progress-track">
        <div
          className="status-card-progress-fill"
          style={{ width: `${weekProgress}%` }}
        />
      </div>
    </article>
  );
}
