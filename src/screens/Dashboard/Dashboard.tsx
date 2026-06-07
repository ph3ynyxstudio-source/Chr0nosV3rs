import { useState } from "react";
import { ProjectCard } from "../../components/ProjectCard/ProjectCard";
import { LastSynthesisCard } from "./components/LastSynthesisCard/LastSynthesisCard";
import { NewProjectCard } from "./components/NewProjectCard/NewProjectCard";
import { OverviewCard } from "./components/OverviewCard/OverviewCard";
import { ProgressCard } from "./components/ProgressCard/ProgressCard";
import { StatusCard } from "./components/StatusCard/StatusCard";
import "./Dashboard.css";

type Project = {
  id: string;
  name: string;
  lastActivity: string;
  progress: number;
  activeWeek: string;
  completedDays: number;
  weekCompletionLabel: string;
  weeklyBars: number[];
  synthesisTitle: string;
  synthesisDate: string;
  weeklySynthesisStatus: "Proposition" | "En relecture" | "Validee";
  synthesisActionLabel: string;
};

const buildChartPoints = (values: number[]) =>
  values
    .map((value, index) => {
      const x = index * 18 + 6;
      const y = 44 - value * 0.34;
      return `${x},${y}`;
    })
    .join(" ");

const projects: Project[] = [
  {
    id: "alpha",
    name: "Projet Alpha",
    lastActivity: "09 / 05 / 2025",
    progress: 68,
    activeWeek: "Semaine 12",
    completedDays: 6,
    weekCompletionLabel: "6 / 7 jours completes",
    weeklyBars: [64, 82, 58, 74, 92, 48, 28],
    synthesisTitle: "Synthese S11",
    synthesisDate: "09 / 05 / 2025",
    weeklySynthesisStatus: "En relecture",
    synthesisActionLabel: "Relire",
  },
  {
    id: "orion",
    name: "Projet Orion",
    lastActivity: "07 / 05 / 2025",
    progress: 42,
    activeWeek: "Semaine 10",
    completedDays: 4,
    weekCompletionLabel: "4 / 7 jours completes",
    weeklyBars: [38, 52, 44, 61, 57, 20, 12],
    synthesisTitle: "Synthese S09",
    synthesisDate: "07 / 05 / 2025",
    weeklySynthesisStatus: "Proposition",
    synthesisActionLabel: "Ouvrir",
  },
  {
    id: "nexus",
    name: "Projet Nexus",
    lastActivity: "05 / 05 / 2025",
    progress: 87,
    activeWeek: "Semaine 14",
    completedDays: 7,
    weekCompletionLabel: "7 / 7 jours completes",
    weeklyBars: [84, 79, 88, 93, 86, 72, 64],
    synthesisTitle: "Synthese S13",
    synthesisDate: "05 / 05 / 2025",
    weeklySynthesisStatus: "Validee",
    synthesisActionLabel: "Consulter",
  },
];

export function Dashboard() {
  const initialProject = projects[0];
  const [activeProject, setActiveProject] = useState(initialProject.id);
  const [activeWeek, setActiveWeek] = useState(initialProject.activeWeek);
  const [weeklySynthesisStatus, setWeeklySynthesisStatus] = useState(
    initialProject.weeklySynthesisStatus,
  );

  const selectedProject =
    projects.find((project) => project.id === activeProject) ?? initialProject;
  const weekProgress = Math.round((selectedProject.completedDays / 7) * 100);
  const chartPoints = buildChartPoints(selectedProject.weeklyBars);

  const handleProjectSelect = (project: Project) => {
    setActiveProject(project.id);
    setActiveWeek(project.activeWeek);
    setWeeklySynthesisStatus(project.weeklySynthesisStatus);
  };

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
              activeWeek={activeWeek}
              completedDays={selectedProject.completedDays}
              weekCompletionLabel={selectedProject.weekCompletionLabel}
              weekProgress={weekProgress}
            />
            <ProgressCard chartPoints={chartPoints} />
            <LastSynthesisCard
              synthesisTitle={selectedProject.synthesisTitle}
              synthesisDate={selectedProject.synthesisDate}
              weeklySynthesisStatus={weeklySynthesisStatus}
              synthesisActionLabel={selectedProject.synthesisActionLabel}
            />
          </section>
        </div>

        <section className="bottom-layout-zone">
          <OverviewCard
            projectName={selectedProject.name}
            activeWeek={activeWeek}
          />

          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              name={project.name}
              lastActivity={project.lastActivity}
              progress={project.progress}
              isActive={activeProject === project.id}
              onClick={() => handleProjectSelect(project)}
            />
          ))}
          <NewProjectCard />
        </section>
      </div>

      <footer className="footer-status">
        <span>● Mode local</span>
        <span>PH3YNYX. Studio</span>
        <span>◇ Données sécurisées</span>
        <span>Souveraineté numérique</span>
      </footer>
    </section>
  );
}
