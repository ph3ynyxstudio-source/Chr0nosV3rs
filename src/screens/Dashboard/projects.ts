export type WeeklyDayStatus = "Completee" | "En cours" | "A faire";

export type WeeklyDay = {
  id: string;
  label: string;
  date: string;
  shortDate: string;
  status: WeeklyDayStatus;
};

export type Project = {
  id: string;
  name: string;
  lastActivity: string;
  progress: number;
  activeWeek: string;
  weekRangeLabel: string;
  completedDays: number;
  weekCompletionLabel: string;
  weeklyBars: number[];
  synthesisTitle: string;
  synthesisDate: string;
  weeklySynthesisStatus: "Proposition" | "En relecture" | "Validee";
  synthesisActionLabel: string;
  weeklyContext: string;
  weeklyDays: WeeklyDay[];
};

export const projects: Project[] = [
  {
    id: "alpha",
    name: "Projet Alpha",
    lastActivity: "09 / 05 / 2025",
    progress: 68,
    activeWeek: "Semaine 12",
    weekRangeLabel: "05 - 11 Mai 2025",
    completedDays: 6,
    weekCompletionLabel: "6 / 7 jours completes",
    weeklyBars: [64, 82, 58, 74, 92, 48, 28],
    synthesisTitle: "Synthese S11",
    synthesisDate: "09 / 05 / 2025",
    weeklySynthesisStatus: "En relecture",
    synthesisActionLabel: "Relire",
    weeklyContext: "Developpement du module d'authentification avancee.",
    weeklyDays: [
      { id: "mon", label: "Lundi", date: "05/05/2025", shortDate: "05/05", status: "Completee" },
      { id: "tue", label: "Mardi", date: "06/05/2025", shortDate: "06/05", status: "Completee" },
      { id: "wed", label: "Mercredi", date: "07/05/2025", shortDate: "07/05", status: "En cours" },
      { id: "thu", label: "Jeudi", date: "08/05/2025", shortDate: "08/05", status: "A faire" },
      { id: "fri", label: "Vendredi", date: "09/05/2025", shortDate: "09/05", status: "A faire" },
      { id: "sat", label: "Samedi", date: "10/05/2025", shortDate: "10/05", status: "A faire" },
      { id: "sun", label: "Dimanche", date: "11/05/2025", shortDate: "11/05", status: "A faire" },
    ],
  },
  {
    id: "orion",
    name: "Projet Orion",
    lastActivity: "07 / 05 / 2025",
    progress: 42,
    activeWeek: "Semaine 10",
    weekRangeLabel: "28 Avr - 04 Mai 2025",
    completedDays: 4,
    weekCompletionLabel: "4 / 7 jours completes",
    weeklyBars: [38, 52, 44, 61, 57, 20, 12],
    synthesisTitle: "Synthese S09",
    synthesisDate: "07 / 05 / 2025",
    weeklySynthesisStatus: "Proposition",
    synthesisActionLabel: "Ouvrir",
    weeklyContext: "Stabilisation du pipeline de collecte et nettoyage des entrees.",
    weeklyDays: [
      { id: "mon", label: "Lundi", date: "28/04/2025", shortDate: "28/04", status: "Completee" },
      { id: "tue", label: "Mardi", date: "29/04/2025", shortDate: "29/04", status: "Completee" },
      { id: "wed", label: "Mercredi", date: "30/04/2025", shortDate: "30/04", status: "En cours" },
      { id: "thu", label: "Jeudi", date: "01/05/2025", shortDate: "01/05", status: "A faire" },
      { id: "fri", label: "Vendredi", date: "02/05/2025", shortDate: "02/05", status: "A faire" },
      { id: "sat", label: "Samedi", date: "03/05/2025", shortDate: "03/05", status: "A faire" },
      { id: "sun", label: "Dimanche", date: "04/05/2025", shortDate: "04/05", status: "A faire" },
    ],
  },
  {
    id: "nexus",
    name: "Projet Nexus",
    lastActivity: "05 / 05 / 2025",
    progress: 87,
    activeWeek: "Semaine 14",
    weekRangeLabel: "12 - 18 Mai 2025",
    completedDays: 7,
    weekCompletionLabel: "7 / 7 jours completes",
    weeklyBars: [84, 79, 88, 93, 86, 72, 64],
    synthesisTitle: "Synthese S13",
    synthesisDate: "05 / 05 / 2025",
    weeklySynthesisStatus: "Validee",
    synthesisActionLabel: "Consulter",
    weeklyContext: "Finalisation du moteur de synthese et validation de la restitution.",
    weeklyDays: [
      { id: "mon", label: "Lundi", date: "12/05/2025", shortDate: "12/05", status: "Completee" },
      { id: "tue", label: "Mardi", date: "13/05/2025", shortDate: "13/05", status: "Completee" },
      { id: "wed", label: "Mercredi", date: "14/05/2025", shortDate: "14/05", status: "Completee" },
      { id: "thu", label: "Jeudi", date: "15/05/2025", shortDate: "15/05", status: "Completee" },
      { id: "fri", label: "Vendredi", date: "16/05/2025", shortDate: "16/05", status: "En cours" },
      { id: "sat", label: "Samedi", date: "17/05/2025", shortDate: "17/05", status: "A faire" },
      { id: "sun", label: "Dimanche", date: "18/05/2025", shortDate: "18/05", status: "A faire" },
    ],
  },
];
