import { useEffect, useState } from "react";
import { type Project } from "../Dashboard/projects";
import { LastSynthesisCard } from "./components/LastSynthesisCard/LastSynthesisCard";
import { SessionOverlay } from "./components/SessionOverlay/SessionOverlay";
import { TodaySessionCard } from "./components/TodaySessionCard/TodaySessionCard";
import { WeeklyDayCard } from "./components/WeeklyDayCard/WeeklyDayCard";
import "./WeeklyView.css";

type WeeklyViewProps = {
  project: Project;
  onBack: () => void;
};

export function WeeklyView({ project, onBack }: WeeklyViewProps) {
  const [openSessionDayIds, setOpenSessionDayIds] = useState<string[]>([]);
  const currentDay =
    project.weeklyDays.find((day) => day.status === "En cours") ??
    project.weeklyDays[0];
  const openDays = openSessionDayIds
    .map((dayId) => project.weeklyDays.find((day) => day.id === dayId))
    .filter((day): day is Project["weeklyDays"][number] => Boolean(day));

  useEffect(() => {
    setOpenSessionDayIds([]);
  }, [project.id]);

  const handleDayOpen = (dayId: string) => {
    setOpenSessionDayIds((currentDayIds) => {
      if (currentDayIds.includes(dayId) || currentDayIds.length >= 2) {
        return currentDayIds;
      }

      return [...currentDayIds, dayId];
    });
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
          <span className="weekly-view-week-chip">Semaine actuelle</span>
          <span className="weekly-view-range-chip">{project.weekRangeLabel}</span>
          <button
            type="button"
            className="weekly-view-close-button"
            onClick={onBack}>
            Retour dashboard
          </button>
        </div>
      </header>

      <main className="weekly-view-content">
        <LastSynthesisCard
          projectName={project.name}
          synthesisDate={project.synthesisDate}
          weeklySynthesisStatus={project.weeklySynthesisStatus}
        />

        <section className="weekly-board">
          <div className="weekly-board-heading">
            <p className="weekly-board-kicker">Semaine en cours</p>
            <h2>{project.activeWeek}</h2>
            <p>Cliquez sur une journee pour ouvrir son contenu.</p>
          </div>

          <div className="weekly-days-grid">
            {project.weeklyDays.map((day) => (
              <WeeklyDayCard
                key={day.id}
                label={day.label}
                shortDate={day.shortDate}
                status={day.status}
                isOpen={openSessionDayIds.includes(day.id)}
                isDisabled={
                  openSessionDayIds.length > 0 &&
                  !openSessionDayIds.includes(day.id)
                }
                onClick={() => handleDayOpen(day.id)}
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
          weeklyContext={project.weeklyContext}
          progress={project.progress}
        />
      </main>

      <footer className="footer-status">
        <span>● Mode local</span>
        <span>PH3YNYX. Studio</span>
        <span>◇ Donnees securisees</span>
        <span>Souverainete numerique</span>
      </footer>

      <SessionOverlay
        openDays={openDays}
        allDays={project.weeklyDays}
        project={project}
        onCloseAll={() => setOpenSessionDayIds([])}
        onCloseDay={handleDayClose}
        onToggleDay={handleDayToggle}
      />
    </section>
  );
}
