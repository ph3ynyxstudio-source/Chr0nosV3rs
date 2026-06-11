use serde::Serialize;
use std::{fs, path::PathBuf};

const PROJECT_DATA_SUBDIRS: [&str; 5] = ["raw", "weekly", "monthly", "quarterly", "archives"];

const EMPTY_SESSION_TEMPLATE_SECTIONS: [&str; 6] = [
    "📌 Contexte",
    "✅ Réalisé",
    "💡 Découvertes",
    "🚧 Blocages",
    "➡️ Suite",
    "🧭 Résumé en une phrase",
];

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct RawSession {
    date: String,
    file_name: String,
    content: String,
}

fn data_dir() -> Result<PathBuf, String> {
    let current_dir =
        std::env::current_dir().map_err(|error| format!("current_dir failed: {error}"))?;
    let direct_data_dir = current_dir.join("data");

    if direct_data_dir.exists() {
        return Ok(direct_data_dir);
    }

    if current_dir.file_name().and_then(|name| name.to_str()) == Some("src-tauri") {
        if let Some(repo_dir) = current_dir.parent() {
            return Ok(repo_dir.join("data"));
        }
    }

    Ok(direct_data_dir)
}

fn validate_project_id(project_id: &str) -> Result<(), String> {
    let trimmed_project_id = project_id.trim();
    let has_reserved_character = trimmed_project_id.chars().any(|character| {
        matches!(
            character,
            '<' | '>' | ':' | '"' | '/' | '\\' | '|' | '?' | '*'
        )
    });
    let has_control_character = trimmed_project_id
        .chars()
        .any(|character| character.is_control());
    let has_windows_reserved_suffix =
        trimmed_project_id.ends_with('.') || trimmed_project_id.ends_with(' ');
    let is_valid = !trimmed_project_id.is_empty()
        && !has_reserved_character
        && !has_control_character
        && !has_windows_reserved_suffix;

    if is_valid {
        Ok(())
    } else {
        Err("nom de projet invalide pour le stockage local".to_string())
    }
}

fn project_dir(project_id: &str) -> Result<PathBuf, String> {
    validate_project_id(project_id)?;
    Ok(data_dir()?.join("projects").join(project_id))
}

fn validate_day_id(day_id: &str) -> Result<(), String> {
    let is_valid = day_id.len() == "2026-06-10".len()
        && day_id.chars().enumerate().all(|(index, character)| {
            if index == 4 || index == 7 {
                character == '-'
            } else {
                character.is_ascii_digit()
            }
        });

    if is_valid {
        Ok(())
    } else {
        Err("date de session invalide".to_string())
    }
}

fn is_markdown_session_file(file_name: &str) -> bool {
    file_name.len() == "2026-06-10.md".len()
        && file_name.ends_with(".md")
        && file_name.strip_suffix(".md").is_some_and(|date| {
            date.chars().enumerate().all(|(index, character)| {
                if index == 4 || index == 7 {
                    character == '-'
                } else {
                    character.is_ascii_digit()
                }
            })
        })
}

fn empty_session_template(day_id: &str) -> String {
    let mut content = format!("# {day_id}\n\n");

    for section in EMPTY_SESSION_TEMPLATE_SECTIONS {
        content.push_str(&format!("# {section}\n\n"));
    }

    content
}

#[tauri::command]
fn create_project_storage(project_id: String) -> Result<(), String> {
    let project_dir = project_dir(&project_id)?;

    fs::create_dir_all(&project_dir)
        .map_err(|error| format!("creation dossier projet echouee: {error}"))?;

    for subdir in PROJECT_DATA_SUBDIRS {
        fs::create_dir_all(project_dir.join(subdir))
            .map_err(|error| format!("creation dossier {subdir} echouee: {error}"))?;
    }

    Ok(())
}

#[tauri::command]
fn list_project_storages() -> Result<Vec<String>, String> {
    let projects_dir = data_dir()?.join("projects");

    if !projects_dir.exists() {
        return Ok(Vec::new());
    }

    let mut project_ids = Vec::new();

    for entry in fs::read_dir(&projects_dir)
        .map_err(|error| format!("lecture dossier projects echouee: {error}"))?
    {
        let entry = entry.map_err(|error| format!("lecture entree projects echouee: {error}"))?;
        let file_type = entry
            .file_type()
            .map_err(|error| format!("lecture type entree projects echouee: {error}"))?;

        if !file_type.is_dir() {
            continue;
        }

        project_ids.push(entry.file_name().to_string_lossy().to_string());
    }

    project_ids.sort();

    Ok(project_ids)
}

#[tauri::command]
fn delete_project_storage(project_id: String) -> Result<(), String> {
    let project_dir = project_dir(&project_id)?;

    if project_dir.exists() {
        fs::remove_dir_all(&project_dir)
            .map_err(|error| format!("suppression dossier projet echouee: {error}"))?;
    }

    Ok(())
}

#[tauri::command]
fn read_project_raw_sessions(project_id: String) -> Result<Vec<RawSession>, String> {
    let raw_dir = project_dir(&project_id)?.join("raw");

    if !raw_dir.exists() {
        return Ok(Vec::new());
    }

    let mut sessions = Vec::new();

    for entry in
        fs::read_dir(&raw_dir).map_err(|error| format!("lecture dossier raw echouee: {error}"))?
    {
        let entry = entry.map_err(|error| format!("lecture entree raw echouee: {error}"))?;
        let file_type = entry
            .file_type()
            .map_err(|error| format!("lecture type fichier raw echouee: {error}"))?;

        if !file_type.is_file() {
            continue;
        }

        let file_name = entry.file_name().to_string_lossy().to_string();

        if !is_markdown_session_file(&file_name) {
            continue;
        }

        let date = file_name.trim_end_matches(".md").to_string();
        let content = fs::read_to_string(entry.path())
            .map_err(|error| format!("lecture fichier {file_name} echouee: {error}"))?;

        sessions.push(RawSession {
            date,
            file_name,
            content,
        });
    }

    sessions.sort_by(|left, right| left.date.cmp(&right.date));

    Ok(sessions)
}

#[tauri::command]
fn ensure_project_raw_session(project_id: String, day_id: String) -> Result<RawSession, String> {
    validate_day_id(&day_id)?;

    let raw_dir = project_dir(&project_id)?.join("raw");
    fs::create_dir_all(&raw_dir)
        .map_err(|error| format!("creation dossier raw echouee: {error}"))?;

    let file_name = format!("{day_id}.md");
    let file_path = raw_dir.join(&file_name);

    if !file_path.exists() {
        fs::write(&file_path, empty_session_template(&day_id))
            .map_err(|error| format!("creation fichier {file_name} echouee: {error}"))?;
    }

    let content = fs::read_to_string(&file_path)
        .map_err(|error| format!("lecture fichier {file_name} echouee: {error}"))?;

    Ok(RawSession {
        date: day_id,
        file_name,
        content,
    })
}

#[tauri::command]
fn save_project_raw_session(
    project_id: String,
    day_id: String,
    content: String,
) -> Result<RawSession, String> {
    validate_day_id(&day_id)?;

    let file_name = format!("{day_id}.md");
    let file_path = project_dir(&project_id)?.join("raw").join(&file_name);

    if !file_path.exists() {
        return Err(format!("session {file_name} introuvable"));
    }

    fs::write(&file_path, &content)
        .map_err(|error| format!("sauvegarde fichier {file_name} echouee: {error}"))?;

    Ok(RawSession {
        date: day_id,
        file_name,
        content,
    })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            create_project_storage,
            delete_project_storage,
            ensure_project_raw_session,
            list_project_storages,
            read_project_raw_sessions,
            save_project_raw_session
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
