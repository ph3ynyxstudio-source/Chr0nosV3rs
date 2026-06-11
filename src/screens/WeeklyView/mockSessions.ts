import { type Project, type WeeklyDay } from "../Dashboard/projects";

export type MockSessionContent = {
  context: string;
  completed: string[];
  discoveries: string[];
  blockers: string[];
  nextSteps: string[];
  summary: string;
};

const sessionOverrides: Record<
  string,
  Partial<Record<string, MockSessionContent>>
> = {
  alpha: {
    tue: {
      context:
        "Conception de l'architecture du module d'authentification et integration des premiers tests.",
      completed: [
        "Architecture de base definie",
        "Mise en place du repo et CI/CD",
        "Premiers tests unitaires",
      ],
      discoveries: [
        "Besoin d'un service d'email dedie",
        "Complexite sur la gestion des roles",
      ],
      blockers: ["Aucun blocage majeur."],
      nextSteps: [
        "Integration complete de l'authentification",
        "Tests d'integration",
      ],
      summary:
        "Les bases du module sont en place, prochaine etape : finaliser l'authentification.",
    },
    wed: {
      context:
        "Avancement sur l'integration complete et resolution des points bloquants.",
      completed: [
        "Service d'email configure",
        "Gestion des roles implementees",
        "Tests d'integration en cours",
      ],
      discoveries: [
        "Des ajustements sont necessaires sur les permissions",
        "Opportunite d'optimiser le flux de connexion",
      ],
      blockers: [
        "Test automatise intermittent",
        "En attente de validation du design system",
      ],
      nextSteps: [
        "Finaliser l'integration de l'authentification",
        "Completer les tests d'integration",
      ],
      summary:
        "Les integrations avancent, focus sur la fiabilite des tests et les permissions.",
    },
  },
};

const statusTone: Record<WeeklyDay["status"], string> = {
  Complétée: "La journee a consolide les elements prioritaires du chantier.",
  "En cours":
    "La journee reste active avec des arbitrages encore en progression.",
  "À créer":
    "La journee attend encore la creation de sa session locale.",
  "À faire":
    "La journee est preparee comme prochaine etape concrete du projet.",
};

export function getMockSessionContent(
  project: Project,
  day: WeeklyDay,
): MockSessionContent {
  const override = sessionOverrides[project.id]?.[day.id];

  if (override) {
    return override;
  }

  return {
    context: `${project.name} - ${day.label.toLowerCase()} : ${statusTone[day.status]}`,
    completed: [
      `Mise a jour du suivi pour ${project.name}`,
      `Clarification des objectifs de ${day.label.toLowerCase()}`,
      "Trace de progression ajoutee dans la vue hebdomadaire",
    ],
    discoveries: [
      `Une piste d'amelioration est apparue pour ${project.name}`,
      "Le rythme hebdomadaire gagnerait a etre mieux compare d'un jour a l'autre",
    ],
    blockers: [
      "Pas de blocage systeme connecte, donnees purement mockees pour le MVP.",
    ],
    nextSteps: [
      `Transformer ${day.label.toLowerCase()} en session exploitable pour la comparaison`,
      "Ouvrir une seconde journee pour confronter les priorites",
    ],
    summary:
      "Cette session mockee sert a valider l'experience d'overlay sans brancher le stockage.",
  };
}
