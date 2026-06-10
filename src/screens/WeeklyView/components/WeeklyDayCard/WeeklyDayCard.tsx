import { type WeeklyDayStatus } from "../../../Dashboard/projects";
import "./WeeklyDayCard.css";

type WeeklyDayCardProps = {
  label: string;
  shortDate: string;
  status: WeeklyDayStatus;
};

const getStatusClassName = (status: WeeklyDayStatus) => {
  if (status === "En cours") {
    return "is-current";
  }

  if (status === "Completee") {
    return "is-complete";
  }

  return "is-pending";
};

export function WeeklyDayCard({
  label,
  shortDate,
  status,
}: WeeklyDayCardProps) {
  return (
    <article className={`weekly-day-card ${getStatusClassName(status)}`}>
      <span className="weekly-day-label">{label}</span>
      <strong>{shortDate}</strong>
      <span className="weekly-day-indicator" aria-hidden="true" />
      <span className="weekly-day-status">{status}</span>
    </article>
  );
}
