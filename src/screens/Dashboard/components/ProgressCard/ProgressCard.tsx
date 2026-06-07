import "./ProgressCard.css";

type ProgressCardProps = {
  chartPoints: string;
};

export function ProgressCard({ chartPoints }: ProgressCardProps) {
  return (
    <article className="progress-card">
      <div className="progress-card-header">
        <h2>Progression globale</h2>
      </div>
      <div className="progress-card-chart-shell" aria-hidden="true">
        <svg
          className="progress-card-line-chart"
          viewBox="0 0 120 48"
          preserveAspectRatio="none"
        >
          <polyline className="progress-card-line-chart-path" points={chartPoints} />
        </svg>
      </div>
    </article>
  );
}
