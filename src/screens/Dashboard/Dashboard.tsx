import { ProjectCard } from "../../components/ProjectCard/ProjectCard";
import { NewProjectCard } from "./components/NewProjectCard/NewProjectCard";
import { NewProjectOverlay } from "./components/NewProjectOverlay/NewProjectOverlay";
import { OverviewCard } from "./components/OverviewCard/OverviewCard";
import { WeeklySummaryOverlay } from "./components/WeeklySummaryOverlay/WeeklySummaryOverlay";
import type { Project } from "./projects";
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
  isWeeklySummaryOverlayOpen,
  onCloseWeeklySummary,
}: DashboardProps) {
  const initialProject = projects[0];
  const selectedProject =
    projects.find((project) => project.id === activeProjectId) ?? null;
  const displayProject = selectedProject ?? initialProject;
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

          <section className="dashboard-grid" />
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
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
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
