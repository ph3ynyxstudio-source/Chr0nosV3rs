export type WeeklyDayStatus = "Complétée" | "En cours" | "À créer" | "À faire";

export type ProjectRawSession = {
  date: string;
  fileName: string;
  content: string;
};

export type WeeklySummary = {
  meta: {
    created_at: string;
    session_count: number;
  };
  progression?: string[];
  achievements: string[];
  blockers: string[];
  resolutions?: string[];
  discoveries?: string[];
  learnings?: string[];
  next?: string[];
  notes: string[];
  summary: string;
};

export type WeeklyDay = {
  id: string;
  label: string;
  date: string;
  shortDate: string;
  status: WeeklyDayStatus;
  hasMeaningfulSession?: boolean;
  isMissed?: boolean;
  rawDateId?: string;
  rawFileName?: string;
  rawContent?: string;
};

export type Project = {
  id: string;
  name: string;
  lastActivity: string;
  progress: number;
  targetWeeks: number;
  currentProjectWeek: number;
  projectProgressLabel: string;
  description: string;
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
  rawSessionDates: string[];
  rawSessions: ProjectRawSession[];
  canGenerateWeeklySummary: boolean;
  weeklySummary?: WeeklySummary;
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

const emptySessionSectionHeadings = [
  "📌 Contexte",
  "✅ Réalisé",
  "💡 Découvertes",
  "📚 Apprentissages",
  "🚧 Blocages",
  "➡️ Suite",
  "🧭 Résumé en une phrase",
];

const normalizeHeadingLine = (line: string) =>
  line.replace(/^(#\s*)+/, "").trim();

export const hasMeaningfulSessionContent = (content: string) =>
  content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .some((line) => {
      const heading = normalizeHeadingLine(line);

      if (/^\d{4}-\d{2}-\d{2}$/.test(heading)) {
        return false;
      }

      if (emptySessionSectionHeadings.includes(heading)) {
        return false;
      }

      return line.replace(/^[-*]\s*/, "").trim().length > 0;
    });

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

export const getWeekStart = (baseDate: Date) => {
  const weekStart = new Date(baseDate);
  const day = weekStart.getDay();
  weekStart.setDate(weekStart.getDate() - day);
  weekStart.setHours(0, 0, 0, 0);

  return weekStart;
};

const getPreviousWeekDateIds = (baseDate = new Date()) => {
  const currentWeekStart = getWeekStart(baseDate);
  const previousWeekStart = new Date(currentWeekStart);
  previousWeekStart.setDate(currentWeekStart.getDate() - 7);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(previousWeekStart);
    date.setDate(previousWeekStart.getDate() + index);

    return formatIsoDate(date);
  });
};

const getProjectWeekNumber = (
  sessions: ProjectRawSession[],
  referenceDate = new Date(),
) => {
  const firstMeaningfulSession = sessions.find((session) =>
    hasMeaningfulSessionContent(session.content),
  );

  if (!firstMeaningfulSession) {
    return 1;
  }

  const firstWeekStart = getWeekStart(parseRawDate(firstMeaningfulSession.date));
  const currentWeekStart = getWeekStart(referenceDate);
  const weekMilliseconds = 7 * 24 * 60 * 60 * 1000;
  const weekOffset = Math.floor(
    (currentWeekStart.getTime() - firstWeekStart.getTime()) / weekMilliseconds,
  );

  return Math.max(1, weekOffset + 1);
};

export const buildProjectProgress = (
  currentProjectWeek: number,
  targetWeeks: number,
) => {
  const safeTargetWeeks = Math.max(1, targetWeeks);

  return Math.min(
    100,
    Math.round((currentProjectWeek / safeTargetWeeks) * 100),
  );
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
    const hasMeaningfulSession = session
      ? hasMeaningfulSessionContent(session.content)
      : false;
    const isPastDay = isoDate < todayIsoDate;
    const isToday = isoDate === todayIsoDate;
    const isMissed = isPastDay && !hasMeaningfulSession;
    const status: WeeklyDayStatus = isPastDay
      ? hasMeaningfulSession
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
      hasMeaningfulSession,
      isMissed,
      rawDateId: session?.date,
      rawFileName: session?.fileName,
      rawContent: session?.content,
    };
  });
};

export const buildWeeklyDataFromRawSessions = (
  sessions: ProjectRawSession[],
  fallbackBaseDate = new Date(),
  referenceDate = new Date(),
) => {
  const startDate = getWeekStart(fallbackBaseDate);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);

  const weeklyDays = buildWeeklyDaysForRange(
    startDate,
    sessions,
    referenceDate,
  );
  const completedDays = weeklyDays.filter(
    (day) => day.status === "Complétée",
  ).length;
  const latestRawDate = sessions[sessions.length - 1]?.date;
  const latestDate = latestRawDate ? parseRawDate(latestRawDate) : fallbackBaseDate;
  const rawSessionDates = sessions.map((session) => session.date);
  const sessionsByDate = new Map(
    sessions.map((session) => [session.date, session]),
  );
  const hasWeekSession = weeklyDays.some((day) => day.hasMeaningfulSession);
  const canGenerateWeeklySummary = getPreviousWeekDateIds(fallbackBaseDate).every(
    (dateId) => {
      const session = sessionsByDate.get(dateId);

      return session ? hasMeaningfulSessionContent(session.content) : false;
    },
  );

  return {
    weeklyDays,
    rawSessionDates,
    rawSessions: sessions,
    canGenerateWeeklySummary,
    weekRangeLabel: formatRangeLabel(startDate, endDate),
    activeWeek: hasWeekSession ? "Semaine détectée" : "Semaine active",
    lastActivity: sessions.length > 0 ? formatUiDate(latestDate) : "Aucune session",
    synthesisDate: sessions.length > 0 ? formatUiDate(latestDate) : "A venir",
    progress: Math.round((completedDays / 7) * 100),
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
): Project => {
  const currentProjectWeek = getProjectWeekNumber(sessions);
  const targetWeeks = project.targetWeeks || 12;

  return {
    ...project,
    ...buildWeeklyDataFromRawSessions(sessions),
    currentProjectWeek,
    targetWeeks,
    progress: buildProjectProgress(currentProjectWeek, targetWeeks),
    projectProgressLabel: `S${currentProjectWeek} / S${targetWeeks}`,
  };
};

export const initialProjects: Project[] = [
  applyRawSessionsToProject(
    {
      id: "chr0nosvers",
      name: "Chr0nosVers",
      lastActivity: "09 / 05 / 2025",
      progress: 68,
      targetWeeks: 12,
      currentProjectWeek: 1,
      projectProgressLabel: "S1 / S12",
      description:
        "Gestion locale de projets, sessions et synthèses hebdomadaires.",
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
      rawSessionDates: [],
      rawSessions: [],
      canGenerateWeeklySummary: false,
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
  targetWeeks = 12,
  description,
}: Pick<Project, "id" | "name" | "lastActivity" | "progress"> &
  Partial<Pick<Project, "targetWeeks" | "description">>): Project {
  const today = new Date();
  const currentProjectWeek = 1;
  const safeTargetWeeks = Math.max(1, targetWeeks);
  const projectDescription =
    description?.trim() || "Projet local suivi par sessions hebdomadaires.";

  return {
    id,
    name,
    lastActivity,
    progress: buildProjectProgress(currentProjectWeek, safeTargetWeeks),
    targetWeeks: safeTargetWeeks,
    currentProjectWeek,
    projectProgressLabel: `S${currentProjectWeek} / S${safeTargetWeeks}`,
    description: projectDescription,
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
    rawSessionDates: [],
    rawSessions: [],
    canGenerateWeeklySummary: false,
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
