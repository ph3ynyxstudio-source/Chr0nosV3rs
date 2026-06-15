import "./ProgressCard.css";

type ProgressSeries = {
  projectId: string;
  projectName: string;
  color: string;
  points: string;
};

type ProgressCardProps = {
  monthWeeks: string[];
  series: ProgressSeries[];
};

export function ProgressCard({ monthWeeks, series }: ProgressCardProps) {
  return (
    <article className="progress-card">
      <div className="progress-card-header">
        <h2>Progression globale</h2>
      </div>
      <div
        className="progress-card-chart-shell"
        aria-label="Sessions enregistrées par semaine du mois">
        <svg
          className="progress-card-line-chart"
          viewBox="0 0 120 48"
          preserveAspectRatio="none"
        >
          {series.map((projectSeries) => (
            <polyline
              key={projectSeries.projectId}
              className="progress-card-line-chart-path"
              points={projectSeries.points}
              stroke={projectSeries.color}
            />
          ))}
        </svg>
      </div>
      <div className="progress-card-axis" aria-hidden="true">
        {monthWeeks.map((weekLabel) => (
          <span key={weekLabel}>{weekLabel}</span>
        ))}
      </div>
      <div className="progress-card-legend">
        {series.map((projectSeries) => (
          <span key={projectSeries.projectId}>
            <i style={{ background: projectSeries.color }} aria-hidden="true" />
            {projectSeries.projectName}
          </span>
        ))}
      </div>
    </article>
  );
}
