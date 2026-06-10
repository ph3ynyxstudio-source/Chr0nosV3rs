import "./TodaySessionCard.css";

type TodaySessionCardProps = {
  projectName: string;
  currentDayLabel: string;
  currentDayDate: string;
  weeklyContext: string;
  progress: number;
  onOpenSession?: () => void;
};

export function TodaySessionCard({
  projectName,
  currentDayLabel,
  currentDayDate,
  weeklyContext,
  progress,
  onOpenSession,
}: TodaySessionCardProps) {
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
        <span className="weekly-side-label">Contexte principal</span>
        <p>{weeklyContext}</p>
      </div>

      <div className="weekly-side-block">
        <span className="weekly-side-label">Progression</span>
        <div className="weekly-progress-row">
          <div className="weekly-progress-line" aria-hidden="true">
            <span style={{ width: `${progress}%` }} />
          </div>
          <strong>{progress}%</strong>
        </div>
      </div>

      <button
        type="button"
        className="weekly-side-action weekly-side-action-purple"
        onClick={onOpenSession}>
        Ouvrir la session
      </button>
    </aside>
  );
}
