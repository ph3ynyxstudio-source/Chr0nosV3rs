import "./App.css";

type Project = {
  name: string;
  lastActivity: string;
  progress: number;
};

const projects: Project[] = [
  { name: "Projet Alpha", lastActivity: "09 / 05 / 2025", progress: 68 },
  { name: "Projet Orion", lastActivity: "07 / 05 / 2025", progress: 42 },
  { name: "Projet Nexus", lastActivity: "05 / 05 / 2025", progress: 87 },
];

function App() {
  return (
    <main className="chronos-app">
      <section className="chronos-shell">
        <div className="main-content">
          {/* ÉTAGE SUPÉRIEUR : Zone Vide, Visuel Asset, Widgets */}
          <div className="top-workspace">
            {/* Gauche : Emplacement réservé pour l'écriture stylisée */}
            <div className="text-stylized-zone">
              {/* Vide pour le moment - Prêt pour ton futur build */}
            </div>

            {/* Centre : Visuel Phénix & Sablier (Asset image) */}
            <div className="center-visual">
              <img
                src="/assets/ui-visual.png"
                alt="Chronos Visual"
                className="main-asset"
              />
            </div>

            {/* Droite : Les 3 Widgets verticaux */}
            <section className="dashboard-grid">
              <article className="status-card">
                <div className="card-header">
                  <h2>Statut actuel</h2>
                  <span>›</span>
                </div>
                <div className="week-status">
                  <div className="ring">6/7</div>
                  <div>
                    <strong>Semaine 12</strong>
                    <small>6 / 7 jours complétés</small>
                  </div>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: "86%" }} />
                </div>
              </article>

              <article className="status-card">
                <div className="card-header">
                  <h2>Progression globale</h2>
                </div>
                <div className="mini-chart">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </article>

              <article className="status-card">
                <div className="card-header">
                  <h2>Dernière synthèse</h2>
                  <span>»</span>
                </div>
                <strong>Synthèse S11</strong>
                <small>09 / 05 / 2025</small>
                <button className="secondary-action" type="button">
                  Ouvrir
                </button>
              </article>
            </section>
          </div>

          {/* ÉTAGE INFÉRIEUR : Vue Globale + Projets + Nouveau Projet */}
          <section className="bottom-layout-zone">
            {/* Carte Vue Globale intégrée en bas à gauche */}
            <article className="overview-card client-global-view">
              <h2>Vue globale des projets</h2>
              <p>
                Consultez l'ensemble de vos projets et suivez leur progression.
              </p>
              <button type="button">Voir tous les projets</button>
            </article>

            {/* Les cartes projets dynamiques */}
            {projects.map((project) => (
              <article className="project-card" key={project.name}>
                <h3>{project.name}</h3>
                <small>Dernière activité</small>
                <p>{project.lastActivity}</p>
                <div className="progress-container">
                  <svg width="28" height="28" viewBox="0 0 28 28">
                    <circle
                      cx="14"
                      cy="14"
                      r="12"
                      stroke="var(--bg-card-glow)"
                      strokeWidth="3"
                      fill="none"
                    />
                    <circle
                      cx="14"
                      cy="14"
                      r="12"
                      stroke="var(--accent-blue)"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray="75.4"
                      strokeDashoffset={75.4 - (project.progress / 100) * 75.4}
                    />
                  </svg>
                  <span className="pct-text">{project.progress}%</span>
                </div>
              </article>
            ))}

            {/* Carte d'action : Nouveau Projet */}
            <article className="new-project-card">
              <span>＋</span>
              <h3>Nouveau projet</h3>
              <p>Créer un nouveau projet</p>
            </article>
          </section>
        </div>

        <footer className="footer-status">
          <span>● Mode local</span>
          <span>◇ Données sécurisées</span>
          <span>Souveraineté numérique</span>
        </footer>
      </section>
    </main>
  );
}

export default App;
