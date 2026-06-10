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

export const initialProjects: Project[] = [
  {
    id: "chronosvers",
    name: "Chr0nosVers",
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
];

const formatUiDate = (date: Date) =>
  new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
    .format(date)
    .replace(/\//g, " / ");

const buildDefaultWeeklyDays = (baseDate: Date): WeeklyDay[] => {
  const dayLabels = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche",
  ];

  return dayLabels.map((label, index) => {
    const currentDate = new Date(baseDate);
    currentDate.setDate(baseDate.getDate() + index);
    const shortDate = new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
    }).format(currentDate);
    const fullDate = new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(currentDate);

    return {
      id: `${label.toLowerCase().slice(0, 3)}-${index + 1}`,
      label,
      date: fullDate,
      shortDate,
      status: index === 0 ? "En cours" : "A faire",
    };
  });
};

export function createProject({
  id,
  name,
  lastActivity,
  progress,
}: Pick<Project, "id" | "name" | "lastActivity" | "progress">): Project {
  const today = new Date();

  return {
    id,
    name,
    lastActivity,
    progress,
    activeWeek: "Semaine active",
    weekRangeLabel: "Semaine actuelle",
    completedDays: 0,
    weekCompletionLabel: "0 / 7 jours completes",
    weeklyBars: [14, 18, 12, 0, 0, 0, 0],
    synthesisTitle: "Synthese a venir",
    synthesisDate: lastActivity,
    weeklySynthesisStatus: "Proposition",
    synthesisActionLabel: "Ouvrir",
    weeklyContext: `Nouvelle session en preparation pour ${name}.`,
    weeklyDays: buildDefaultWeeklyDays(today),
  };
}

export function buildNewProjectName(projects: Project[]) {
  const nextProjectNumber =
    projects.reduce((maxValue, project) => {
      const match = /^Projet\s+(\d+)$/i.exec(project.name);

      if (!match) {
        return maxValue;
      }

      return Math.max(maxValue, Number(match[1]));
    }, 0) + 1;

  return `Projet ${nextProjectNumber}`;
}

export function formatProjectLastActivity(date: Date) {
  return formatUiDate(date);
}
