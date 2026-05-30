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
        {/* ================= ÉTAGE SUPÉRIEUR (3 Colonnes) ================= */}
        <div className="top-layout-zone">
          {/* Gauche : Sidebar (Haut ultra-compact) */}
          <aside className="sidebar">
            <div className="brand">
              <span className="brand-mark">⏳</span>
              <span className="brand-name">↻hr0nosV3rs</span>
            </div>

            <div className="sidebar-block">
              <h2>Projets</h2>

              <button className="primary-action" type="button">
                <span className="action-icon">＋</span>
                <span>
                  <strong>Nouveau projet</strong>
                </span>
              </button>

              <button className="nav-action" type="button">
                <span className="action-icon">◎</span>
                <span>
                  <strong>Vue globale</strong>
                </span>
              </button>
            </div>
          </aside>

          {/* Milieu : Cockpit textuel + Sablier central */}
          <header className="hero">
            <div className="hero-copy">
              <p className="eyebrow">↻hr0nosV3rs</p>
              <h1>
                Ton temps.
                <br />
                Ta mémoire.
                <br />
                Ta progression.
              </h1>
              <p>
                Chaque projet compte. Chaque souvenir construit. Chaque synthèse
                demeure.
              </p>
            </div>

            <div className="hero-visual" aria-label="Espace visuel central">
              <div className="hourglass">⏳</div>
              <div className="visual-label">Mémoire active</div>
            </div>
          </header>

          {/* Droite : Panneau des 3 blocs empilés */}
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

        {/* ================= ÉTAGE INFÉRIEUR (Alignement horizontal total) ================= */}
        <div className="bottom-layout-zone">
          {/* Zone Orange : Reste vertical de la sidebar */}
          <div className="sidebar-bottom-empty">
            <div className="empty-box">
              <span>▣</span>
              <p>Mes projets</p>
              <small>
                Aucun projet pour le moment. Créez votre premier projet ou
                consultez la vue globale.
              </small>
            </div>
          </div>

          {/* Suite Horizontale : Les 5 boîtes grises */}
          <section className="projects-overview">
            <article className="overview-card">
              <span className="overview-icon">◎</span>
              <h2>Vue globale des projets</h2>
              <p>
                Consultez l’ensemble de vos projets et suivez leur progression.
              </p>
              <button type="button">Voir tous les projets</button>
            </article>

            {projects.map((project) => (
              <article className="project-card" key={project.name}>
                <h3>{project.name}</h3>
                <small>Dernière activité</small>
                <p>{project.lastActivity}</p>
                <small>Progression</small>
                <div className="project-progress">
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <strong>{project.progress}%</strong>
                </div>
              </article>
            ))}

            <article className="new-project-card">
              <span>＋</span>
              <h3>Nouveau projet</h3>
              <p>Créer un nouveau projet</p>
            </article>
          </section>
        </div>

        {/* Footer */}
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
