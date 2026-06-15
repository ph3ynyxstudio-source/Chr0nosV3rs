import { ProjectCard } from "../../components/ProjectCard/ProjectCard";
import { LastSynthesisCard } from "./components/LastSynthesisCard/LastSynthesisCard";
import { NewProjectCard } from "./components/NewProjectCard/NewProjectCard";
import { NewProjectOverlay } from "./components/NewProjectOverlay/NewProjectOverlay";
import { OverviewCard } from "./components/OverviewCard/OverviewCard";
import { ProgressCard } from "./components/ProgressCard/ProgressCard";
import { StatusCard } from "./components/StatusCard/StatusCard";
import { WeeklySummaryOverlay } from "./components/WeeklySummaryOverlay/WeeklySummaryOverlay";
import { hasMeaningfulSessionContent, type Project } from "./projects";
import "./Dashboard.css";

const projectChartColors = [
  "#54d6ff",
  "#b574ff",
  "#7e5cff",
  "#11e0ff",
  "#cf98ff",
];

const getMonthWeekLabels = (date = new Date()) => {
  const daysInMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0,
  ).getDate();
  const weekCount = Math.min(5, Math.ceil(daysInMonth / 7));

  return Array.from({ length: weekCount }, (_, index) => `S${index + 1}`);
};

const getSessionMonthWeekIndex = (dateValue: string) => {
  const day = Number(dateValue.split("-")[2]);

  return Math.min(4, Math.floor((day - 1) / 7));
};

const buildMonthlyActivitySeries = (projects: Project[]) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const monthWeeks = getMonthWeekLabels(currentDate);
  const weekCount = monthWeeks.length;
  const countsByProject = projects.slice(0, 5).map((project) => {
    const counts = Array.from({ length: weekCount }, () => 0);

    project.rawSessions.forEach((session) => {
      const [year, month] = session.date.split("-").map(Number);

      if (
        year !== currentYear ||
        month !== currentMonth ||
        !hasMeaningfulSessionContent(session.content)
      ) {
        return;
      }

      const weekIndex = getSessionMonthWeekIndex(session.date);

      if (weekIndex < weekCount) {
        counts[weekIndex] += 1;
      }
    });

    return { project, counts };
  });
  const maxCount = Math.max(
    1,
    ...countsByProject.flatMap((projectCounts) => projectCounts.counts),
  );
  const xStep = weekCount > 1 ? 108 / (weekCount - 1) : 0;

  const series = countsByProject.map(({ project, counts }, projectIndex) => ({
    projectId: project.id,
    projectName: project.name,
    color: projectChartColors[projectIndex % projectChartColors.length],
    points: counts
      .map((count, weekIndex) => {
        const x = weekCount === 1 ? 60 : weekIndex * xStep + 6;
        const y = 42 - (count / maxCount) * 32;

        return `${x},${y}`;
      })
      .join(" "),
  }));

  return { monthWeeks, series };
};

type DashboardProps = {
  projects: Project[];
  activeProjectId: string | null;
  onOpenWeeklyView: (projectId: string) => void;
  onProjectSelect: (project: Project) => void;
  onOpenCreateProjectOverlay: () => void;
  isCreateProjectOverlayOpen: boolean;
  projectOverlayMode: "create" | "edit";
  newProjectName: string;
  newProjectTargetWeeks: string;
  newProjectDescription: string;
  onNewProjectNameChange: (value: string) => void;
  onNewProjectTargetWeeksChange: (value: string) => void;
  onNewProjectDescriptionChange: (value: string) => void;
  onCancelCreateProject: () => void;
  onConfirmCreateProject: () => void;
  onDeleteProject: (project: Project) => void;
  onOpenEditProjectOverlay: (project: Project) => void;
  onGenerateWeeklySummary: (projectId: string) => void;
  generatingWeeklyProjectId: string | null;
  isWeeklySummaryOverlayOpen: boolean;
  onOpenWeeklySummary: () => void;
  onCloseWeeklySummary: () => void;
};

export function Dashboard({
  projects,
  activeProjectId,
  onOpenWeeklyView,
  onProjectSelect,
  onOpenCreateProjectOverlay,
  isCreateProjectOverlayOpen,
  projectOverlayMode,
  newProjectName,
  newProjectTargetWeeks,
  newProjectDescription,
  onNewProjectNameChange,
  onNewProjectTargetWeeksChange,
  onNewProjectDescriptionChange,
  onCancelCreateProject,
  onConfirmCreateProject,
  onDeleteProject,
  onOpenEditProjectOverlay,
  onGenerateWeeklySummary,
  generatingWeeklyProjectId,
  isWeeklySummaryOverlayOpen,
  onOpenWeeklySummary,
  onCloseWeeklySummary,
}: DashboardProps) {
  const initialProject = projects[0];
  const selectedProject =
    projects.find((project) => project.id === activeProjectId) ?? null;
  const displayProject = selectedProject ?? initialProject;
  const weekProgress = Math.round((displayProject.completedDays / 7) * 100);
  const monthlyActivity = buildMonthlyActivitySeries(projects);
  const placeholderCount = Math.max(0, 3 - projects.length);
  const shouldScrollProjects = projects.length >= 4;

  return (
    <section className="chronos-shell">
      <div className="main-content">
        <div className="top-workspace">
          <div className="text-stylized-zone">
            <img
              src="/assets/TEXTE_Style_officiel_2000x500.png"
              alt="CHR0NOSV3RS"
              className="app-logo"
            />
            <div className="hero-copy">
              <div className="hero-copy-lead">
                <p>Ton temps. Ta mémoire. Ta progression.</p>
              </div>
              <div className="hero-copy-body">
                <p>Chaque projet compte.</p>
                <p>Chaque souvenir construit.</p>
                <p>Chaque synthese demeure.</p>
              </div>
            </div>
          </div>

          <div className="center-visual">
            <img
              src="/assets/Dashboard-asset.png"
              alt="Chronos Visual"
              className="main-asset"
            />
          </div>

          <section className="dashboard-grid">
            <StatusCard
              completedDays={displayProject.completedDays}
              weekCompletionLabel={displayProject.weekCompletionLabel}
              weekProgress={weekProgress}
            />
            <ProgressCard
              monthWeeks={monthlyActivity.monthWeeks}
              series={monthlyActivity.series}
            />
            <LastSynthesisCard
              synthesisTitle={displayProject.synthesisTitle}
              weeklySynthesisStatus={displayProject.weeklySynthesisStatus}
              weeklySummary={displayProject.weeklySummary}
              canGenerateWeeklySummary={displayProject.canGenerateWeeklySummary}
              isGenerating={generatingWeeklyProjectId === displayProject.id}
              onGenerateWeeklySummary={() =>
                onGenerateWeeklySummary(displayProject.id)
              }
              onOpenWeeklySummary={onOpenWeeklySummary}
            />
          </section>
        </div>

        <section className="bottom-layout-zone">
          <OverviewCard
            projectName={selectedProject?.name ?? null}
            activeWeek={selectedProject?.activeWeek ?? null}
            onOpenWeeklyView={() => {
              if (selectedProject) {
                onOpenWeeklyView(selectedProject.id);
              }
            }}
          />

          <div
            className={`projects-center-zone ${
              shouldScrollProjects ? "is-scrollable" : ""
            }`}>
            <div className="projects-center-track">
              {projects.map((project) => (
                <div key={project.id} className="projects-center-item">
                  <ProjectCard
                    name={project.name}
                    lastActivity={project.lastActivity}
                    progress={project.progress}
                    progressLabel={project.projectProgressLabel}
                    isActive={activeProjectId === project.id}
                    onClick={() => onProjectSelect(project)}
                    onDelete={() => onDeleteProject(project)}
                    onEdit={() => onOpenEditProjectOverlay(project)}
                    canDelete={projects.length > 1}
                  />
                </div>
              ))}

              {!shouldScrollProjects &&
                Array.from({ length: placeholderCount }, (_, index) => (
                  <div
                    key={`placeholder-${index + 1}`}
                    className="projects-center-placeholder"
                    aria-hidden="true"
                  />
                ))}
            </div>
          </div>

          <div className="new-project-fixed-slot">
            <NewProjectCard onClick={onOpenCreateProjectOverlay} />
          </div>
        </section>
      </div>

      <footer className="footer-status">
        <span>● Mode local</span>
        <span>PH3YNYX. Studio</span>
        <span>◇ Données sécurisées</span>
        <span>Souveraineté numérique</span>
      </footer>

      <NewProjectOverlay
        isOpen={isCreateProjectOverlayOpen}
        mode={projectOverlayMode}
        projectName={newProjectName}
        projectTargetWeeks={newProjectTargetWeeks}
        projectDescription={newProjectDescription}
        onProjectNameChange={onNewProjectNameChange}
        onProjectTargetWeeksChange={onNewProjectTargetWeeksChange}
        onProjectDescriptionChange={onNewProjectDescriptionChange}
        onCancel={onCancelCreateProject}
        onConfirm={onConfirmCreateProject}
      />

      <WeeklySummaryOverlay
        isOpen={isWeeklySummaryOverlayOpen}
        weeklySummary={displayProject.weeklySummary}
        status={displayProject.weeklySynthesisStatus}
        onClose={onCloseWeeklySummary}
      />
    </section>
  );
}
