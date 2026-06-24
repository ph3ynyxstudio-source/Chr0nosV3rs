import { invoke } from "@tauri-apps/api/core";
import {
  initialChr0nosVersRawSessions,
  type ProjectRawSession,
} from "../screens/Dashboard/projects";

type TauriWindow = Window & {
  __TAURI_INTERNALS__?: unknown;
};

export type ProjectMetadata = {
  name: string;
  description: string;
  targetWeeks: number;
  createdAt: string;
  updatedAt: string;
};

const isTauriRuntime = () =>
  typeof window !== "undefined" &&
  "__TAURI_INTERNALS__" in (window as TauriWindow);

export async function createProjectStorage(projectId: string) {
  if (!isTauriRuntime()) {
    return false;
  }

  await invoke("create_project_storage", { projectId });

  return true;
}

export async function deleteProjectStorage(projectId: string) {
  if (!isTauriRuntime()) {
    return false;
  }

  await invoke("delete_project_storage", { projectId });

  return true;
}

export async function openProjectRawDataDir(projectId: string) {
  if (!isTauriRuntime()) {
    return null;
  }

  return await invoke<string>("open_project_raw_data_dir", {
    projectId,
  });
}

export async function readProjectMetadata(
  projectId: string,
): Promise<ProjectMetadata | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return await invoke<ProjectMetadata | null>("read_project_metadata", {
    projectId,
  });
}

export async function saveProjectMetadata({
  projectId,
  name,
  description,
  targetWeeks,
}: {
  projectId: string;
  name: string;
  description: string;
  targetWeeks: number;
}): Promise<ProjectMetadata | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return await invoke<ProjectMetadata>("save_project_metadata", {
    projectId,
    name,
    description,
    targetWeeks,
  });
}

export async function ensureProjectRawSession(
  projectId: string,
  dayId: string,
): Promise<ProjectRawSession> {
  if (!isTauriRuntime()) {
    throw new Error(
      "Stockage local indisponible hors application Tauri : impossible de creer la session.",
    );
  }

  return await invoke<ProjectRawSession>("ensure_project_raw_session", {
    projectId,
    dayId,
  });
}

export async function listProjectStorages(): Promise<string[]> {
  if (!isTauriRuntime()) {
    return [];
  }

  return await invoke<string[]>("list_project_storages");
}

export async function readProjectRawSessions(
  projectId: string,
): Promise<ProjectRawSession[]> {
  if (isTauriRuntime()) {
    return await invoke<ProjectRawSession[]>("read_project_raw_sessions", {
      projectId,
    });
  }

  if (projectId === "chr0nosvers") {
    return initialChr0nosVersRawSessions;
  }

  return [];
}

export async function saveProjectRawSession({
  projectId,
  dayId,
  content,
}: {
  projectId: string;
  dayId: string;
  content: string;
}): Promise<ProjectRawSession> {
  if (!isTauriRuntime()) {
    throw new Error(
      "Stockage local indisponible hors application Tauri : impossible de sauvegarder la session.",
    );
  }

  return await invoke<ProjectRawSession>("save_project_raw_session", {
    projectId,
    dayId,
    content,
  });
}

export async function generateWeeklySummary(projectId: string): Promise<string> {
  if (!isTauriRuntime()) {
    throw new Error(
      "Stockage local indisponible hors application Tauri : impossible de generer la synthese.",
    );
  }

  return await invoke<string>("generate_weekly_summary", { projectId });
}

export async function readWeeklySummary(
  projectId: string,
): Promise<string | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  return await invoke<string | null>("read_weekly_summary", { projectId });
}
