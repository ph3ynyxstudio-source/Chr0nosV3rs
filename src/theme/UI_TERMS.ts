export const UI_TERMS = {
  // Navigation (Sidebar)
  NAV_GLOBAL: "Vue globale",
  NAV_PROJECTS: "Mes projets",
  ACTION_NEW_PROJECT: "Nouveau projet",

  // Cockpit (Le cœur du MVP)
  COCKPIT_TITLE: "Cockpit",
  SECTION_PROGRESS: "Progression",
  SECTION_INTENTIONS: "Intentions",

  // États & Philosophie
  STATUS_LOCAL: "Mode local",
  STATUS_SECURE: "Données sécurisées",
  PHILOSOPHY: "Données locales privées",

  // Navigation Temporelle
  TIME_CARD: "Carte temporelle",
} as const;

export type UiTerms = typeof UI_TERMS;
