import { useEffect, useState } from "react";
import { Dashboard } from "./screens/Dashboard/Dashboard";
import {
  buildNewProjectName,
  applyRawSessionsToProject,
  createProject,
  formatProjectLastActivity,
  initialProjects,
  type Project,
} from "./screens/Dashboard/projects";
import { WeeklyView } from "./screens/WeeklyView/WeeklyView";
import {
  createProjectStorage,
  deleteProjectStorage,
  ensureProjectRawSession,
  listProjectStorages,
  readProjectRawSessions,
  saveProjectRawSession,
} from "./storage/projectStorage";
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

function getLocalDayId(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function buildProjectFromStorage(projectId: string): Project {
  return createProject({
    id: projectId,
    name: projectId,
    lastActivity: "Projet local",
    progress: 0,
  });
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

  const refreshProjectRawSessions = async (projectId: string) => {
    const rawSessions = await readProjectRawSessions(projectId);

    setProjects((currentProjects) =>
      currentProjects.map((project) =>
        project.id === projectId
          ? applyRawSessionsToProject(project, rawSessions)
          : project,
      ),
    );
  };

  const handleOpenTodaySession = async (projectId: string) => {
    const todayDayId = getLocalDayId();

    try {
      await ensureProjectRawSession(projectId, todayDayId);
      await refreshProjectRawSessions(projectId);
    } catch (error) {
      window.alert(`Ouverture de la session impossible : ${String(error)}`);
      return null;
    }

    return todayDayId;
  };

  const handleSaveRawSession = async (
    projectId: string,
    dayId: string,
    content: string,
  ) => {
    await saveProjectRawSession({
      projectId,
      dayId,
      content,
    });
    await refreshProjectRawSessions(projectId);
  };

  useEffect(() => {
    const loadStoredProjects = async () => {
      const projectIds = await listProjectStorages();

      if (projectIds.length === 0) {
        return;
      }

      const loadedProjects = projectIds.map(buildProjectFromStorage);
      setProjects(loadedProjects);
      setActiveProjectId(loadedProjects[0]?.id ?? null);
    };

    void loadStoredProjects();
  }, []);

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

  const handleConfirmCreateProject = async () => {
    const trimmedProjectName = newProjectName.trim();

    if (!trimmedProjectName) {
      return;
    }

    const alreadyExists = projects.some(
      (project) =>
        project.id.toLocaleLowerCase() ===
        trimmedProjectName.toLocaleLowerCase(),
    );

    if (alreadyExists) {
      window.alert("Un projet avec ce nom existe deja.");
      return;
    }

    const createdAt = new Date();
    const nextProject = createProject({
      id: trimmedProjectName,
      name: trimmedProjectName,
      lastActivity: formatProjectLastActivity(createdAt),
      progress: 0,
    });

    try {
      const didCreateStorage = await createProjectStorage(nextProject.id);

      if (!didCreateStorage) {
        window.alert(
          "Stockage local indisponible hors application Tauri : le dossier data/projects/ n'a pas ete cree.",
        );
        return;
      }
    } catch (error) {
      window.alert(`Creation du stockage projet impossible : ${String(error)}`);
      return;
    }

    setProjects((currentProjects) => [...currentProjects, nextProject]);
    setActiveProjectId(nextProject.id);
    setIsCreateProjectOverlayOpen(false);
    setNewProjectName("");
  };

  const handleDeleteProject = async (project: Project) => {
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

    try {
      const didDeleteStorage = await deleteProjectStorage(project.id);

      if (!didDeleteStorage) {
        window.alert(
          "Stockage local indisponible hors application Tauri : le dossier projet n'a pas ete supprime.",
        );
        return;
      }
    } catch (error) {
      window.alert(`Suppression du stockage projet impossible : ${String(error)}`);
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
                void refreshProjectRawSessions(projectId);
                setActiveProjectId(projectId);
                setActiveScreen("weekly");
              }}
            />
          ) : (
            <WeeklyView
              project={activeProject}
              onOpenTodaySession={handleOpenTodaySession}
              onSaveRawSession={handleSaveRawSession}
              onBack={() => setActiveScreen("dashboard")}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
