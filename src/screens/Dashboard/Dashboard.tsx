import { ProjectCard } from "../../components/ProjectCard/ProjectCard";
import { NewProjectCard } from "./components/NewProjectCard/NewProjectCard";
import { NewProjectOverlay } from "./components/NewProjectOverlay/NewProjectOverlay";
import { SessionShortcut } from "./components/SessionShortcut/SessionShortcut";
import { ThemeToggle } from "./components/ThemeToggle/ThemeToggle";
import { WeeklySummaryOverlay } from "./components/WeeklySummaryOverlay/WeeklySummaryOverlay";
import {
  getTodayDateId,
  getWeekdayLabel,
  parseRawDate,
  type Project,
} from "./projects";
import "./Dashboard.css";

type DashboardProps = {
  projects: Project[];
  activeProjectId: string | null;
  onOpenWeeklyView: (projectId: string) => void;
  onProjectSelect: (project: Project) => void;
  onOpenCreateProjectOverlay: () => void;
  isCreateProjectOverlayOpen: boolean;
  projectOverlayMode: "create" | "edit";
  newProjectName: string;
  newProjectDescription: string;
  onNewProjectNameChange: (value: string) => void;
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
  onEnsureRawSession: (
    projectId: string,
    dayId: string,
  ) => Promise<string | null>;
  onSaveRawSession: (
    projectId: string,
    dayId: string,
    content: string,
  ) => Promise<void>;
  theme: "sombre" | "aube";
  onToggleTheme: () => void;
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
  newProjectDescription,
  onNewProjectNameChange,
  onNewProjectDescriptionChange,
  onCancelCreateProject,
  onConfirmCreateProject,
  onDeleteProject,
  onOpenEditProjectOverlay,
  isWeeklySummaryOverlayOpen,
  onCloseWeeklySummary,
  onEnsureRawSession,
  onSaveRawSession,
  theme,
  onToggleTheme,
}: DashboardProps) {
  const initialProject = projects[0];
  const selectedProject =
    projects.find((project) => project.id === activeProjectId) ?? null;
  const displayProject = selectedProject ?? initialProject;

  const selectedProjectWeeklyDays = selectedProject?.weeklyDays ?? [];
  const todayDay =
    selectedProjectWeeklyDays.find((day) => day.status === "En cours") ??
    selectedProjectWeeklyDays.find((day) => day.status === "À créer") ??
    selectedProjectWeeklyDays[selectedProjectWeeklyDays.length - 1] ??
    null;
  const selectedProjectRawSessions = selectedProject?.rawSessions ?? [];
  const lastSession =
    selectedProjectRawSessions[selectedProjectRawSessions.length - 1] ?? null;

  const handleSaveTodaySession = async (content: string) => {
    if (!selectedProject) {
      return;
    }

    const dayId = todayDay?.rawDateId ?? getTodayDateId();

    await onEnsureRawSession(selectedProject.id, dayId);
    await onSaveRawSession(selectedProject.id, dayId, content);
  };

  return (
    <section className="chronos-shell">
      <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />

      <div className="main-content">
        <div className="side-column">
          <div className="text-stylized-zone">
            <img
              src={
                theme === "aube"
                  ? "/assets/theme clair titre.png"
                  : "/assets/TEXTE_Style_officiel_2000x500.png"
              }
              alt="CHR0NOSV3RS"
              className="app-logo"
            />
          </div>

          <aside className="project-sidebar">
            {projects.map((project) => (
              <div key={project.id} className="project-sidebar-item">
                <ProjectCard
                  name={project.name}
                  lastActivity={project.lastActivity}
                  isActive={activeProjectId === project.id}
                  onClick={() => onProjectSelect(project)}
                  onDelete={() => onDeleteProject(project)}
                  onEdit={() => onOpenEditProjectOverlay(project)}
                  canDelete={projects.length > 1}
                />
              </div>
            ))}

            <div className="project-sidebar-item">
              <NewProjectCard onClick={onOpenCreateProjectOverlay} />
            </div>
          </aside>
        </div>

        <div className="center-visual">
          <SessionShortcut
            projectName={selectedProject?.name ?? null}
            disabled={!selectedProject}
            onOpenWeeklyView={() => {
              if (selectedProject) {
                onOpenWeeklyView(selectedProject.id);
              }
            }}
            lastSession={
              lastSession
                ? {
                    label: getWeekdayLabel(parseRawDate(lastSession.date)),
                    date: lastSession.date,
                    content: lastSession.content,
                  }
                : null
            }
            today={{
              label: todayDay?.label ?? "Aujourd'hui",
              date: todayDay?.date ?? "",
              initialContent: todayDay?.rawContent ?? "",
            }}
            onSaveToday={handleSaveTodaySession}
          />
        </div>
      </div>

      <footer className="footer-status">
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </footer>

      <NewProjectOverlay
        isOpen={isCreateProjectOverlayOpen}
        mode={projectOverlayMode}
        projectName={newProjectName}
        projectDescription={newProjectDescription}
        onProjectNameChange={onNewProjectNameChange}
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
