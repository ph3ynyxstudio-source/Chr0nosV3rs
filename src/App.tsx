import { useEffect, useState } from "react";
import { Dashboard } from "./screens/Dashboard/Dashboard";
import { projects, type Project } from "./screens/Dashboard/projects";
import { WeeklyView } from "./screens/WeeklyView/WeeklyView";
import "./App.css";

const DASHBOARD_WIDTH = 1620;
const DASHBOARD_HEIGHT = 900;

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
  const [activeScreen, setActiveScreen] = useState<"dashboard" | "weekly">(
    "dashboard",
  );
  const [activeProjectId, setActiveProjectId] = useState<string | null>(
    projects[0]?.id ?? null,
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
              activeProjectId={activeProjectId}
              onProjectSelect={handleProjectSelect}
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
