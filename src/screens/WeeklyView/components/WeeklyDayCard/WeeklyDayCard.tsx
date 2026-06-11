import { type WeeklyDayStatus } from "../../../Dashboard/projects";
import "./WeeklyDayCard.css";

type WeeklyDayCardProps = {
  label: string;
  shortDate: string;
  status: WeeklyDayStatus;
  isDisabled?: boolean;
  isOpen?: boolean;
  onClick?: () => void;
};

const getStatusClassName = (status: WeeklyDayStatus) => {
  if (status === "En cours") {
    return "is-current";
  }

  if (status === "Complétée") {
    return "is-complete";
  }

  return "is-pending";
};

export function WeeklyDayCard({
  label,
  shortDate,
  status,
  isDisabled = false,
  isOpen = false,
  onClick,
}: WeeklyDayCardProps) {
  return (
    <button
      type="button"
      className={`weekly-day-card ${getStatusClassName(status)} ${
        isOpen ? "is-open" : ""
      }`}
      onClick={onClick}
      disabled={isDisabled}>
      <span className="weekly-day-label">{label}</span>
      <strong>{shortDate}</strong>
      <span className="weekly-day-indicator" aria-hidden="true" />
      <span className="weekly-day-status">{status}</span>
    </button>
  );
}
