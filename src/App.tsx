import { useEffect, useState } from "react";
import { Dashboard } from "./screens/Dashboard/Dashboard";
import {
  buildNewProjectName,
  applyRawSessionsToProject,
  buildProjectProgress,
  createProject,
  formatProjectLastActivity,
  initialProjects,
  type Project,
  type WeeklySummary,
} from "./screens/Dashboard/projects";
import { WeeklyView } from "./screens/WeeklyView/WeeklyView";
import {
  createProjectStorage,
  deleteProjectStorage,
  ensureProjectRawSession,
  generateWeeklySummary,
  listProjectStorages,
  readWeeklySummary,
  readProjectRawSessions,
  saveProjectRawSession,
} from "./storage/projectStorage";
import "./App.css";

const DASHBOARD_WIDTH = 1620;
const DASHBOARD_HEIGHT = 900;
const MVP_MAX_PROJECTS = 5;
type ProjectOverlayMode = "create" | "edit";

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

function getWeeklySummaryErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);

  if (!message || message === "[object Object]") {
    return "La synthèse n’a pas pu être générée pour une raison inconnue.";
  }

  if (message.includes("Aucune session passée trouvée")) {
    return "Aucune session passée trouvée cette semaine ou la semaine précédente. Ajoutez au moins une session pour générer une synthèse.";
  }

  if (
    message.includes("generation weekly Python echouee") ||
    message.includes("Python") ||
    message.includes("a echoue")
  ) {
    return "La synthèse n’a pas pu être générée. Le moteur Python a rencontré une erreur.";
  }

  if (
    message.includes("lecture synthese weekly echouee") ||
    message.includes("JSON weekly invalide") ||
    message.includes("fichier ne peut pas etre lu")
  ) {
    return "La synthèse existe, mais son fichier ne peut pas être lu.";
  }

  if (message.includes("projet") && message.includes("selection")) {
    return "Sélectionnez un projet avant de générer une synthèse.";
  }

  return message.length < 180
    ? `La synthèse n’a pas pu être générée : ${message}`
    : "La synthèse n’a pas pu être générée pour une raison inconnue.";
}

function App() {
  const [dashboardScale, setDashboardScale] = useState(getDashboardScale);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [activeScreen, setActiveScreen] = useState<"dashboard" | "weekly">(
    "dashboard",
  );
  const [isCreateProjectOverlayOpen, setIsCreateProjectOverlayOpen] =
    useState(false);
  const [projectOverlayMode, setProjectOverlayMode] =
    useState<ProjectOverlayMode>("create");
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectTargetWeeks, setNewProjectTargetWeeks] = useState("12");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [activeProjectId, setActiveProjectId] = useState<string | null>(
    initialProjects[0]?.id ?? null,
  );
  const [generatingWeeklyProjectId, setGeneratingWeeklyProjectId] = useState<
    string | null
  >(null);
  const [isWeeklySummaryOverlayOpen, setIsWeeklySummaryOverlayOpen] =
    useState(false);

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

  const applyWeeklySummaryToProject = (
    project: Project,
    weeklySummary: WeeklySummary,
  ): Project => {
    const synthesisDate = weeklySummary.meta.created_at.split("T")[0];

    return {
      ...project,
      weeklySummary,
      synthesisTitle: "Synthèse hebdomadaire",
      synthesisDate,
      weeklySynthesisStatus: "Proposition",
      synthesisActionLabel: "Ouvrir",
    };
  };

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

  const handleGenerateWeeklySummary = async (projectId: string) => {
    if (!projectId.trim()) {
      window.alert("Sélectionnez un projet avant de générer une synthèse.");
      return;
    }

    setGeneratingWeeklyProjectId(projectId);

    try {
      const summaryJson = await generateWeeklySummary(projectId);
      const weeklySummary = JSON.parse(summaryJson) as WeeklySummary;

      setProjects((currentProjects) =>
        currentProjects.map((project) =>
          project.id === projectId
            ? applyWeeklySummaryToProject(project, weeklySummary)
            : project,
        ),
      );
    } catch (error) {
      window.alert(getWeeklySummaryErrorMessage(error));
    } finally {
      setGeneratingWeeklyProjectId(null);
    }
  };

  useEffect(() => {
    const loadStoredProjects = async () => {
      const projectIds = await listProjectStorages();

      if (projectIds.length === 0) {
        return;
      }

      const loadedProjects = await Promise.all(
        projectIds.map(async (projectId) => {
          const rawSessions = await readProjectRawSessions(projectId);
          const weeklySummaryJson = await readWeeklySummary(projectId).catch(
            (error) => {
              window.alert(getWeeklySummaryErrorMessage(error));

              return null;
            },
          );
          const project = applyRawSessionsToProject(
            buildProjectFromStorage(projectId),
            rawSessions,
          );

          if (!weeklySummaryJson) {
            return project;
          }

          return applyWeeklySummaryToProject(
            project,
            JSON.parse(weeklySummaryJson) as WeeklySummary,
          );
        }),
      );

      setProjects(loadedProjects);
      setActiveProjectId(loadedProjects[0]?.id ?? null);
    };

    void loadStoredProjects();
  }, []);

  const handleProjectSelect = (project: Project) => {
    setActiveProjectId(project.id);
    setIsWeeklySummaryOverlayOpen(false);
  };

  const handleUpdateProjectDetails = ({
    projectId,
    name,
    description,
    targetWeeks,
  }: {
    projectId: string;
    name: string;
    description: string;
    targetWeeks: number;
  }) => {
    const trimmedName = name.trim();
    const safeTargetWeeks = Math.max(1, targetWeeks);

    if (!trimmedName) {
      window.alert("Le nom du projet ne peut pas etre vide.");
      return;
    }

    setProjects((currentProjects) =>
      currentProjects.map((project) => {
        if (project.id !== projectId) {
          return project;
        }

        return {
          ...project,
          name: trimmedName,
          description:
            description.trim() ||
            "Projet local suivi par sessions hebdomadaires.",
          targetWeeks: safeTargetWeeks,
          progress: buildProjectProgress(
            project.currentProjectWeek,
            safeTargetWeeks,
          ),
          projectProgressLabel: `S${project.currentProjectWeek} / S${safeTargetWeeks}`,
        };
      }),
    );
  };

  const handleOpenCreateProjectOverlay = () => {
    if (projects.length >= MVP_MAX_PROJECTS) {
      window.alert("Limite MVP atteinte : 5 projets maximum.");
      return;
    }

    setProjectOverlayMode("create");
    setEditingProjectId(null);
    setNewProjectName(buildNewProjectName(projects));
    setNewProjectTargetWeeks("12");
    setNewProjectDescription("");
    setIsCreateProjectOverlayOpen(true);
  };

  const handleOpenEditProjectOverlay = (project: Project) => {
    setProjectOverlayMode("edit");
    setEditingProjectId(project.id);
    setNewProjectName(project.name);
    setNewProjectTargetWeeks(String(project.targetWeeks));
    setNewProjectDescription(project.description);
    setIsCreateProjectOverlayOpen(true);
    setActiveProjectId(project.id);
  };

  const handleCancelCreateProject = () => {
    setIsCreateProjectOverlayOpen(false);
    setProjectOverlayMode("create");
    setEditingProjectId(null);
    setNewProjectName("");
    setNewProjectTargetWeeks("12");
    setNewProjectDescription("");
  };

  const handleConfirmProjectOverlay = async () => {
    const trimmedProjectName = newProjectName.trim();

    if (!trimmedProjectName) {
      return;
    }

    if (projectOverlayMode === "edit") {
      if (!editingProjectId) {
        return;
      }

      const targetWeeks = Number.parseInt(newProjectTargetWeeks, 10);

      handleUpdateProjectDetails({
        projectId: editingProjectId,
        name: trimmedProjectName,
        description: newProjectDescription,
        targetWeeks: Number.isFinite(targetWeeks) ? targetWeeks : 12,
      });

      setIsCreateProjectOverlayOpen(false);
      setProjectOverlayMode("create");
      setEditingProjectId(null);
      setNewProjectName("");
      setNewProjectTargetWeeks("12");
      setNewProjectDescription("");
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
    const targetWeeks = Number.parseInt(newProjectTargetWeeks, 10);
    const nextProject = createProject({
      id: trimmedProjectName,
      name: trimmedProjectName,
      lastActivity: formatProjectLastActivity(createdAt),
      progress: 0,
      targetWeeks: Number.isFinite(targetWeeks) ? targetWeeks : 12,
      description: newProjectDescription,
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
    setProjectOverlayMode("create");
    setEditingProjectId(null);
    setNewProjectName("");
    setNewProjectTargetWeeks("12");
    setNewProjectDescription("");
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
              projectOverlayMode={projectOverlayMode}
              newProjectName={newProjectName}
              newProjectTargetWeeks={newProjectTargetWeeks}
              newProjectDescription={newProjectDescription}
              onNewProjectNameChange={setNewProjectName}
              onNewProjectTargetWeeksChange={setNewProjectTargetWeeks}
              onNewProjectDescriptionChange={setNewProjectDescription}
              onCancelCreateProject={handleCancelCreateProject}
              onConfirmCreateProject={handleConfirmProjectOverlay}
              onDeleteProject={handleDeleteProject}
              onOpenEditProjectOverlay={handleOpenEditProjectOverlay}
              onGenerateWeeklySummary={handleGenerateWeeklySummary}
              generatingWeeklyProjectId={generatingWeeklyProjectId}
              isWeeklySummaryOverlayOpen={isWeeklySummaryOverlayOpen}
              onOpenWeeklySummary={() => setIsWeeklySummaryOverlayOpen(true)}
              onCloseWeeklySummary={() => setIsWeeklySummaryOverlayOpen(false)}
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
