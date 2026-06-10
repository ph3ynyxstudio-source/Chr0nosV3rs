import { useEffect, useState } from "react";
import { Dashboard } from "./screens/Dashboard/Dashboard";
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

  return (
    <div className="dashboard-lock-viewport">
      <div
        className="dashboard-lock-canvas"
        style={{
          transform: `translate(-50%, -50%) scale(${dashboardScale})`,
        }}>
        <main className="chronos-app">
          <Dashboard />
        </main>
      </div>
    </div>
  );
}

export default App;
