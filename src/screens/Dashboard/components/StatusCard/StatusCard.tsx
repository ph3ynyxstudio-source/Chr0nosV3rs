import { type CSSProperties } from "react";
import "./StatusCard.css";

type StatusCardProps = {
  completedDays: number;
  weekCompletionLabel: string;
  weekProgress: number;
};

export function StatusCard({
  completedDays,
  weekCompletionLabel,
  weekProgress,
}: StatusCardProps) {
  const progressDegrees = Math.round((weekProgress / 100) * 360);
  const ringStyle = {
    "--week-progress-deg": `${progressDegrees}deg`,
  } as CSSProperties;

  return (
    <article className="status-card">
      <div className="status-card-header">
        <h2>Statut actuel</h2>
        <span>›</span>
      </div>
      <div className="status-card-week-status">
        <div
          className="status-card-ring"
          style={ringStyle}>
          <span>{completedDays}/7</span>
        </div>
        <div>
          <strong>Semaine active</strong>
          <small>{weekCompletionLabel}</small>
        </div>
      </div>
    </article>
  );
}
