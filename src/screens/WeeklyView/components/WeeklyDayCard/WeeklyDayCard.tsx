import { type WeeklyDayStatus } from "../../../Dashboard/projects";
import calendarNeonIcon from "../../../../assets/icons/neon/calendar-neon.svg?raw";
import checkNeonIcon from "../../../../assets/icons/neon/check-neon.svg?raw";
import closeNeonIcon from "../../../../assets/icons/neon/close-neon.svg?raw";
import editNeonIcon from "../../../../assets/icons/neon/edit-neon.svg?raw";
import "./WeeklyDayCard.css";

type WeeklyDayCardProps = {
  label: string;
  shortDate: string;
  status: WeeklyDayStatus;
  isMissed?: boolean;
  isDisabled?: boolean;
  isOpen?: boolean;
  onClick?: () => void;
};

const getStatusClassName = (status: WeeklyDayStatus, isMissed: boolean) => {
  if (isMissed) {
    return "is-missed";
  }

  if (status === "En cours") {
    return "is-current";
  }

  if (status === "Complétée") {
    return "is-complete";
  }

  return "is-pending";
};

const getStatusIcon = (status: WeeklyDayStatus, isMissed: boolean) => {
  if (isMissed) {
    return closeNeonIcon;
  }

  if (status === "Complétée") {
    return checkNeonIcon;
  }

  if (status === "En cours" || status === "À créer") {
    return editNeonIcon;
  }

  return calendarNeonIcon;
};

const getStatusLabel = (status: WeeklyDayStatus, isMissed: boolean) => {
  if (isMissed) {
    return "Non complétée";
  }

  if (status === "À créer") {
    return "Créer session";
  }

  if (status === "À faire") {
    return "À venir";
  }

  return status;
};

function NeonIcon({
  className,
  svg,
}: {
  className: string;
  svg: string;
}) {
  return (
    <span
      className={className}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

export function WeeklyDayCard({
  label,
  shortDate,
  status,
  isMissed = false,
  isDisabled = false,
  isOpen = false,
  onClick,
}: WeeklyDayCardProps) {
  const statusIcon = getStatusIcon(status, isMissed);
  const statusLabel = getStatusLabel(status, isMissed);

  return (
    <button
      type="button"
      className={`weekly-day-card ${getStatusClassName(status, isMissed)} ${
        isOpen ? "is-open" : ""
      }`}
      onClick={onClick}
      disabled={isDisabled}>
      <span className="weekly-day-label">{label}</span>
      <strong>{shortDate}</strong>
      <span className="weekly-day-indicator" aria-hidden="true">
        <NeonIcon
          className="weekly-icon weekly-icon--status"
          svg={statusIcon}
        />
      </span>
      <span className="weekly-day-status">{statusLabel}</span>
    </button>
  );
}
