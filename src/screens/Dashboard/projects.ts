export type WeeklyDayStatus = "Complétée" | "En cours" | "À créer" | "À faire";

export type ProjectRawSession = {
  date: string;
  fileName: string;
  content: string;
};

export type WeeklyDay = {
  id: string;
  label: string;
  date: string;
  shortDate: string;
  status: WeeklyDayStatus;
  rawDateId?: string;
  rawFileName?: string;
  rawContent?: string;
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

const chr0nosVersRawModules = import.meta.glob<string>(
  "/data/projects/chr0nosvers/raw/*.md",
  {
    eager: true,
    import: "default",
    query: "?raw",
  },
);

const formatIsoDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatUiDate = formatIsoDate;

const formatShortDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${day}/${month}`;
};

const formatFullDate = formatIsoDate;

const formatRangeLabel = (startDate: Date, endDate: Date) => {
  return `${formatIsoDate(startDate)} - ${formatIsoDate(endDate)}`;
};

const getWeekdayLabel = (date: Date) =>
  new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
  })
    .format(date)
    .replace(/^./, (value) => value.toUpperCase());

const parseRawDate = (dateValue: string) => {
  const [year, month, day] = dateValue.split("-").map(Number);

  return new Date(year, month - 1, day);
};

const getWeekStart = (baseDate: Date) => {
  const weekStart = new Date(baseDate);
  const day = weekStart.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  weekStart.setDate(weekStart.getDate() + mondayOffset);
  weekStart.setHours(0, 0, 0, 0);

  return weekStart;
};

const buildRawSessionsFromModules = (
  modules: Record<string, string>,
): ProjectRawSession[] =>
  Object.entries(modules)
    .map(([filePath, content]) => {
      const filePathParts = filePath.split("/");
      const fileName = filePathParts[filePathParts.length - 1] ?? "";
      const date = fileName.match(/^(\d{4}-\d{2}-\d{2})\.md$/)?.[1];

      if (!date) {
        return null;
      }

      return {
        date,
        fileName,
        content,
      };
    })
    .filter((session): session is ProjectRawSession => Boolean(session))
    .sort((left, right) => left.date.localeCompare(right.date));

export const initialChr0nosVersRawSessions =
  buildRawSessionsFromModules(chr0nosVersRawModules);

const buildWeeklyDaysForRange = (
  startDate: Date,
  sessions: ProjectRawSession[],
  referenceDate = new Date(),
): WeeklyDay[] => {
  const todayIsoDate = formatIsoDate(referenceDate);
  const sessionsByDate = new Map(
    sessions.map((session) => [session.date, session]),
  );

  return Array.from({ length: 7 }, (_, index) => {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + index);
    const isoDate = formatIsoDate(currentDate);
    const session = sessionsByDate.get(isoDate);
    const isPastDay = isoDate < todayIsoDate;
    const isToday = isoDate === todayIsoDate;
    const status: WeeklyDayStatus = isPastDay
      ? session
        ? "Complétée"
        : "À faire"
      : isToday
        ? session
          ? "En cours"
          : "À créer"
        : "À faire";

    return {
      id: session ? `raw-${isoDate}` : `empty-${isoDate}`,
      label: getWeekdayLabel(currentDate),
      date: formatFullDate(currentDate),
      shortDate: formatShortDate(currentDate),
      status,
      rawDateId: session?.date,
      rawFileName: session?.fileName,
      rawContent: session?.content,
    };
  });
};

const buildWeeklyDataFromRawSessions = (
  sessions: ProjectRawSession[],
  fallbackBaseDate = new Date(),
) => {
  const startDate =
    sessions.length > 0
      ? parseRawDate(sessions[0].date)
      : getWeekStart(fallbackBaseDate);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);

  const weeklyDays = buildWeeklyDaysForRange(
    startDate,
    sessions,
    fallbackBaseDate,
  );
  const completedDays = weeklyDays.filter(
    (day) => day.status === "Complétée",
  ).length;
  const latestRawDate = sessions[sessions.length - 1]?.date;
  const latestDate = latestRawDate ? parseRawDate(latestRawDate) : fallbackBaseDate;

  return {
    weeklyDays,
    weekRangeLabel: formatRangeLabel(startDate, endDate),
    activeWeek: sessions.length > 0 ? "Semaine détectée" : "Semaine active",
    lastActivity: sessions.length > 0 ? formatUiDate(latestDate) : "Aucune session",
    synthesisDate: sessions.length > 0 ? formatUiDate(latestDate) : "A venir",
    completedDays,
    weekCompletionLabel: `${completedDays} / 7 jours complétés`,
    weeklyBars: weeklyDays.map((day) => {
      if (day.status === "Complétée") {
        return 100;
      }

      if (day.status === "En cours") {
        return 72;
      }

      return 0;
    }),
  };
};

export const applyRawSessionsToProject = (
  project: Project,
  sessions: ProjectRawSession[],
): Project => ({
  ...project,
  ...buildWeeklyDataFromRawSessions(sessions),
});

export const initialProjects: Project[] = [
  applyRawSessionsToProject(
    {
      id: "chr0nosvers",
      name: "Chr0nosVers",
      lastActivity: "09 / 05 / 2025",
      progress: 68,
      activeWeek: "Semaine 12",
      weekRangeLabel: "05 - 11 Mai 2025",
      completedDays: 6,
      weekCompletionLabel: "6 / 7 jours complétés",
      weeklyBars: [64, 82, 58, 74, 92, 48, 28],
      synthesisTitle: "Synthèse S11",
      synthesisDate: "09 / 05 / 2025",
      weeklySynthesisStatus: "En relecture",
      synthesisActionLabel: "Relire",
      weeklyContext: "Developpement du module d'authentification avancee.",
      weeklyDays: [],
    },
    initialChr0nosVersRawSessions,
  ),
];

const buildDefaultWeeklyDays = (baseDate: Date): WeeklyDay[] =>
  buildWeeklyDaysForRange(getWeekStart(baseDate), [], baseDate);

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
    weekCompletionLabel: "0 / 7 jours complétés",
    weeklyBars: [0, 0, 0, 0, 0, 0, 0],
    synthesisTitle: "Synthèse à venir",
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
