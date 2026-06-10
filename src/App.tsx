import { useEffect, useState } from "react";
import { Dashboard } from "./screens/Dashboard/Dashboard";
import {
  buildNewProjectName,
  createProject,
  formatProjectLastActivity,
  initialProjects,
  type Project,
} from "./screens/Dashboard/projects";
import { WeeklyView } from "./screens/WeeklyView/WeeklyView";
import "./App.css";

const DASHBOARD_WIDTH = 1620;
const DASHBOARD_HEIGHT = 900;
const MVP_MAX_PROJECTS = 5;

function getDashboardScale() {
  if (typeof window === "undefined") {
    return 1;
  }

  return Math.min(
    1,
    window.innerWidth / DASHBOARD_WIDTH,
    window.innerHeight / DASHBOARD_HEIGHT,
  );
}

function App() {
  const [dashboardScale, setDashboardScale] = useState(getDashboardScale);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [activeScreen, setActiveScreen] = useState<"dashboard" | "weekly">(
    "dashboard",
  );
  const [isCreateProjectOverlayOpen, setIsCreateProjectOverlayOpen] =
    useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [activeProjectId, setActiveProjectId] = useState<string | null>(
    initialProjects[0]?.id ?? null,
  );

  useEffect(() => {
    const handleResize = () => {
      setDashboardScale(getDashboardScale());
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const activeProject =
    projects.find((project) => project.id === activeProjectId) ?? projects[0];

  const handleProjectSelect = (project: Project) => {
    setActiveProjectId(project.id);
  };

  const handleOpenCreateProjectOverlay = () => {
    if (projects.length >= MVP_MAX_PROJECTS) {
      window.alert("Limite MVP atteinte : 5 projets maximum.");
      return;
    }

    setNewProjectName(buildNewProjectName(projects));
    setIsCreateProjectOverlayOpen(true);
  };

  const handleCancelCreateProject = () => {
    setIsCreateProjectOverlayOpen(false);
    setNewProjectName("");
  };

  const handleConfirmCreateProject = () => {
    const trimmedProjectName = newProjectName.trim();

    if (!trimmedProjectName) {
      return;
    }

    const createdAt = new Date();
    const nextProject = createProject({
      id: `project-${createdAt.getTime()}`,
      name: trimmedProjectName,
      lastActivity: formatProjectLastActivity(createdAt),
      progress: 0,
    });

    setProjects((currentProjects) => [...currentProjects, nextProject]);
    setActiveProjectId(nextProject.id);
    setIsCreateProjectOverlayOpen(false);
    setNewProjectName("");
  };

  const handleDeleteProject = (project: Project) => {
    if (projects.length <= 1) {
      window.alert("Le dernier projet du MVP ne peut pas etre supprime.");
      return;
    }

    const firstConfirmation = window.confirm(
      `Supprimer le projet ${project.name} ?`,
    );

    if (!firstConfirmation) {
      return;
    }

    const secondConfirmation = window.confirm(
      `Confirmation finale : supprimer definitivement ${project.name} du state local ?`,
    );

    if (!secondConfirmation) {
      return;
    }

    const remainingProjects = projects.filter(
      (currentProject) => currentProject.id !== project.id,
    );

    setProjects(remainingProjects);

    if (activeProjectId === project.id) {
      setActiveProjectId(remainingProjects[0]?.id ?? null);
    }

    if (activeScreen === "weekly" && activeProjectId === project.id) {
      setActiveScreen("dashboard");
    }
  };

  return (
    <div className="dashboard-lock-viewport">
      <div
        className="dashboard-lock-canvas"
        style={{
          transform: `translate(-50%, -50%) scale(${dashboardScale})`,
        }}>
        <main className="chronos-app">
          {activeScreen === "dashboard" ? (
            <Dashboard
              projects={projects}
              activeProjectId={activeProjectId}
              onProjectSelect={handleProjectSelect}
              onOpenCreateProjectOverlay={handleOpenCreateProjectOverlay}
              isCreateProjectOverlayOpen={isCreateProjectOverlayOpen}
              newProjectName={newProjectName}
              onNewProjectNameChange={setNewProjectName}
              onCancelCreateProject={handleCancelCreateProject}
              onConfirmCreateProject={handleConfirmCreateProject}
              onDeleteProject={handleDeleteProject}
              onOpenWeeklyView={(projectId) => {
                setActiveProjectId(projectId);
                setActiveScreen("weekly");
              }}
            />
          ) : (
            <WeeklyView
              project={activeProject}
              onBack={() => setActiveScreen("dashboard")}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
