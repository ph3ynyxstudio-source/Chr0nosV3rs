import { useEffect, useState } from "react";
import {
  buildWeeklyDataFromRawSessions,
  getWeekStart,
  type Project,
} from "../Dashboard/projects";
import closeNeonIcon from "../../assets/icons/neon/close-neon.svg?raw";
import { WeeklySummaryOverlay } from "../Dashboard/components/WeeklySummaryOverlay/WeeklySummaryOverlay";
import { LastSynthesisCard } from "./components/LastSynthesisCard/LastSynthesisCard";
import { SessionOverlay } from "./components/SessionOverlay/SessionOverlay";
import { TodaySessionCard } from "./components/TodaySessionCard/TodaySessionCard";
import { WeeklyDayCard } from "./components/WeeklyDayCard/WeeklyDayCard";
import "./WeeklyView.css";

type WeeklyViewProps = {
  project: Project;
  onOpenTodaySession: (projectId: string) => Promise<string | null>;
  onEnsureRawSession: (
    projectId: string,
    dayId: string,
  ) => Promise<string | null>;
  onSaveRawSession: (
    projectId: string,
    dayId: string,
    content: string,
  ) => Promise<void>;
  onOpenProjectRawDataDir: (projectId: string) => void;
  onBack: () => void;
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

export function WeeklyView({
  project,
  onOpenTodaySession,
  onEnsureRawSession,
  onSaveRawSession,
  onOpenProjectRawDataDir,
  onBack,
}: WeeklyViewProps) {
  const [openSessionDayIds, setOpenSessionDayIds] = useState<string[]>([]);
  const [isWeeklySummaryOverlayOpen, setIsWeeklySummaryOverlayOpen] =
    useState(false);
  const [viewWeekStart, setViewWeekStart] = useState(() =>
    getWeekStart(new Date()),
  );
  const localReferenceDate = new Date();
  const viewedWeek = buildWeeklyDataFromRawSessions(
    project.rawSessions,
    viewWeekStart,
    localReferenceDate,
  );
  const currentWeekStart = getWeekStart(localReferenceDate);
  const isViewingCurrentWeek =
    viewWeekStart.getTime() === currentWeekStart.getTime();
  const currentDay =
    project.weeklyDays.find((day) => day.status === "En cours") ??
    project.weeklyDays.find((day) => day.status === "À créer") ??
    project.weeklyDays[0];
  const currentDayId = currentDay?.id;
  const openDays = openSessionDayIds
    .map((dayId) => viewedWeek.weeklyDays.find((day) => day.id === dayId))
    .filter((day): day is Project["weeklyDays"][number] => Boolean(day))
    .sort((leftDay, rightDay) => {
      if (openSessionDayIds.length < 2) {
        return 0;
      }

      if (leftDay.id === currentDayId) {
        return 1;
      }

      if (rightDay.id === currentDayId) {
        return -1;
      }

      return 0;
    });

  useEffect(() => {
    setOpenSessionDayIds([]);
    setIsWeeklySummaryOverlayOpen(false);
    setViewWeekStart(getWeekStart(new Date()));
  }, [project.id]);

  const handleWeekNavigation = (direction: -1 | 1) => {
    setOpenSessionDayIds([]);
    setViewWeekStart((currentStart) => {
      const nextStart = new Date(currentStart);
      nextStart.setDate(currentStart.getDate() + direction * 7);

      if (nextStart > currentWeekStart) {
        return currentStart;
      }

      return getWeekStart(nextStart);
    });
  };

  const addOpenSessionDay = (dayId: string) => {
    setOpenSessionDayIds((currentDayIds) => {
      if (currentDayIds.includes(dayId) || currentDayIds.length >= 2) {
        return currentDayIds;
      }

      return [...currentDayIds, dayId];
    });
  };

  const handleDayOpen = async (day: Project["weeklyDays"][number]) => {
    if (openSessionDayIds.includes(day.id) || openSessionDayIds.length >= 2) {
      return;
    }

    if (day.rawDateId) {
      addOpenSessionDay(day.id);
      return;
    }

    const createdDayId = await onEnsureRawSession(project.id, day.date);

    if (!createdDayId) {
      return;
    }

    addOpenSessionDay(`raw-${createdDayId}`);
  };

  const handleDayClose = (dayId: string) => {
    setOpenSessionDayIds((currentDayIds) =>
      currentDayIds.filter((currentId) => currentId !== dayId),
    );
  };

  const handleDayToggle = (dayId: string) => {
    setOpenSessionDayIds((currentDayIds) => {
      if (currentDayIds.includes(dayId)) {
        return currentDayIds.filter((currentId) => currentId !== dayId);
      }

      if (currentDayIds.length >= 2) {
        return currentDayIds;
      }

      return [...currentDayIds, dayId];
    });
  };

  const handleTodaySessionOpen = async () => {
    const todayDayId = await onOpenTodaySession(project.id);

    if (!todayDayId) {
      return;
    }

    setViewWeekStart(currentWeekStart);
    setOpenSessionDayIds([`raw-${todayDayId}`]);
  };

  return (
    <section className="weekly-view-shell">
      <header className="weekly-view-header">
        <div className="weekly-view-brand">
          <img
            src="/assets/TEXTE_Style_officiel_2000x500.png"
            alt="CHR0NOSV3RS"
            className="weekly-view-logo"
          />
          <div className="weekly-view-title-group">
            <span className="weekly-view-project-chip">{project.name}</span>
            <h1>Visualisation hebdomadaire</h1>
          </div>
        </div>

        <div className="weekly-view-actions">
          <span className="weekly-view-week-chip">
            {isViewingCurrentWeek ? "Semaine actuelle" : "Semaine consultée"}
          </span>
          <div className="weekly-view-range-nav">
            <button
              type="button"
              className="weekly-view-range-arrow"
              aria-label="Semaine précédente"
              onClick={() => handleWeekNavigation(-1)}>
              ‹
            </button>
            <span className="weekly-view-range-chip">
              {viewedWeek.weekRangeLabel}
            </span>
            <button
              type="button"
              className="weekly-view-range-arrow"
              aria-label="Semaine suivante"
              onClick={() => handleWeekNavigation(1)}
              disabled={isViewingCurrentWeek}>
              ›
            </button>
          </div>
          <button
            type="button"
            className="weekly-view-close-button"
            onClick={onBack}
            aria-label="Retour dashboard">
            <NeonIcon
              className="weekly-icon weekly-close-icon"
              svg={closeNeonIcon}
            />
          </button>
        </div>
      </header>

      <main className="weekly-view-content">
        <LastSynthesisCard
          projectName={project.name}
          synthesisDate={project.synthesisDate}
          weeklySynthesisStatus={project.weeklySynthesisStatus}
          hasSynthesis={Boolean(project.weeklySummary)}
          onOpenSynthesis={
            project.weeklySummary
              ? () => setIsWeeklySummaryOverlayOpen(true)
              : undefined
          }
        />

        <section className="weekly-board">
          <div className="weekly-board-heading">
            <p className="weekly-board-kicker">
              {isViewingCurrentWeek ? "Semaine en cours" : "Semaine consultée"}
            </p>
            <h2>{viewedWeek.activeWeek}</h2>
            <p>Cliquez sur une journee pour ouvrir son contenu.</p>
          </div>

          <div className="weekly-days-grid">
            {viewedWeek.weeklyDays.map((day) => (
              <WeeklyDayCard
                key={day.id}
                label={day.label}
                shortDate={day.shortDate}
                status={day.status}
                isMissed={day.isMissed}
                isOpen={openSessionDayIds.includes(day.id)}
                isDisabled={
                  openSessionDayIds.length > 0 &&
                  !openSessionDayIds.includes(day.id)
                }
                onClick={() => void handleDayOpen(day)}
              />
            ))}
          </div>

          <div className="weekly-board-note">
            Ouvrez jusqu'a 2 journees en meme temps pour comparer ou retranscrire
            des objectifs non atteints.
          </div>
        </section>

        <TodaySessionCard
          projectName={project.name}
          currentDayLabel={currentDay.label}
          currentDayDate={currentDay.date}
          projectDescription={project.description}
          onOpenSession={handleTodaySessionOpen}
          onOpenRawSessions={() => onOpenProjectRawDataDir(project.id)}
        />
      </main>

      <footer className="footer-status">
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </footer>

      <SessionOverlay
        projectId={project.id}
        openDays={openDays}
        allDays={viewedWeek.weeklyDays}
        onCloseAll={() => setOpenSessionDayIds([])}
        onCloseDay={handleDayClose}
        onSaveDay={(dayId, content) =>
          onSaveRawSession(project.id, dayId, content)
        }
        onToggleDay={handleDayToggle}
      />

      <WeeklySummaryOverlay
        isOpen={isWeeklySummaryOverlayOpen}
        weeklySummary={project.weeklySummary}
        status={project.weeklySynthesisStatus}
        onClose={() => setIsWeeklySummaryOverlayOpen(false)}
      />
    </section>
  );
}
