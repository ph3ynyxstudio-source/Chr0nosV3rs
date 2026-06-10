import { ProjectCard } from "../../components/ProjectCard/ProjectCard";
import { LastSynthesisCard } from "./components/LastSynthesisCard/LastSynthesisCard";
import { NewProjectCard } from "./components/NewProjectCard/NewProjectCard";
import { NewProjectOverlay } from "./components/NewProjectOverlay/NewProjectOverlay";
import { OverviewCard } from "./components/OverviewCard/OverviewCard";
import { ProgressCard } from "./components/ProgressCard/ProgressCard";
import { StatusCard } from "./components/StatusCard/StatusCard";
import { type Project } from "./projects";
import "./Dashboard.css";

const buildChartPoints = (values: number[]) =>
  values
    .map((value, index) => {
      const x = index * 18 + 6;
      const y = 44 - value * 0.34;
      return `${x},${y}`;
    })
    .join(" ");

type DashboardProps = {
  projects: Project[];
  activeProjectId: string | null;
  onOpenWeeklyView: (projectId: string) => void;
  onProjectSelect: (project: Project) => void;
  onOpenCreateProjectOverlay: () => void;
  isCreateProjectOverlayOpen: boolean;
  newProjectName: string;
  onNewProjectNameChange: (value: string) => void;
  onCancelCreateProject: () => void;
  onConfirmCreateProject: () => void;
  onDeleteProject: (project: Project) => void;
};

export function Dashboard({
  projects,
  activeProjectId,
  onOpenWeeklyView,
  onProjectSelect,
  onOpenCreateProjectOverlay,
  isCreateProjectOverlayOpen,
  newProjectName,
  onNewProjectNameChange,
  onCancelCreateProject,
  onConfirmCreateProject,
  onDeleteProject,
}: DashboardProps) {
  const initialProject = projects[0];
  const selectedProject =
    projects.find((project) => project.id === activeProjectId) ?? null;
  const displayProject = selectedProject ?? initialProject;
  const weekProgress = Math.round((displayProject.completedDays / 7) * 100);
  const chartPoints = buildChartPoints(displayProject.weeklyBars);
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
              activeWeek={displayProject.activeWeek}
              completedDays={displayProject.completedDays}
              weekCompletionLabel={displayProject.weekCompletionLabel}
              weekProgress={weekProgress}
            />
            <ProgressCard chartPoints={chartPoints} />
            <LastSynthesisCard
              synthesisTitle={displayProject.synthesisTitle}
              synthesisDate={displayProject.synthesisDate}
              weeklySynthesisStatus={displayProject.weeklySynthesisStatus}
              synthesisActionLabel={displayProject.synthesisActionLabel}
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
                    isActive={activeProjectId === project.id}
                    onClick={() => onProjectSelect(project)}
                    onDelete={() => onDeleteProject(project)}
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
        projectName={newProjectName}
        onProjectNameChange={onNewProjectNameChange}
        onCancel={onCancelCreateProject}
        onConfirm={onConfirmCreateProject}
      />
    </section>
  );
}
