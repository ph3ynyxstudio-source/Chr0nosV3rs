mod runner;

use chrono::{Datelike, Duration, Local, NaiveDate};
use serde::Serialize;
use std::{fs, path::PathBuf};
use tauri::Manager;

const PROJECT_DATA_SUBDIRS: [&str; 5] = ["raw", "weekly", "monthly", "quarterly", "archives"];
const EXPECTED_WEEKLY_SESSION_COUNT: usize = 7;
const NO_PREVIOUS_WEEK_SESSION_MESSAGE: &str = "Aucune session trouvée pour la semaine précédente. Ajoutez au moins une session pour générer une synthèse.";

const EMPTY_SESSION_TEMPLATE_SECTIONS: [&str; 7] = [
    "📌 Contexte",
    "✅ Réalisé",
    "💡 Découvertes",
    "📚 Apprentissages",
    "🚧 Blocages",
    "➡️ Suite",
    "🧭 Résumé en une phrase",
];

const APPRENTISSAGES_GUIDE_LINES: [&str; 10] = [
    "Capacités observées aujourd'hui (optionnel) :",
    "- Analyse",
    "- Documentation",
    "- Débogage",
    "- Organisation",
    "- Communication",
    "- Créativité",
    "- Recherche",
    "- Résolution de problème",
    "Quelles capacités crois-tu avoir utilisées ou développées aujourd'hui ?",
];

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct RawSession {
    date: String,
    file_name: String,
    content: String,
}

struct WeeklyInput {
    folder: PathBuf,
}

fn data_dir(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    let current_dir =
        std::env::current_dir().map_err(|error| format!("current_dir failed: {error}"))?;
    let direct_data_dir = current_dir.join("data");

    if direct_data_dir.exists() {
        return Ok(direct_data_dir);
    }

    if current_dir.file_name().and_then(|name| name.to_str()) == Some("src-tauri") {
        if let Some(repo_dir) = current_dir.parent() {
            let repo_data_dir = repo_dir.join("data");

            if repo_data_dir.exists() {
                return Ok(repo_data_dir);
            }
        }
    }

    app.path()
        .app_data_dir()
        .map_err(|error| format!("resolution AppData echouee: {error}"))
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

fn project_dir(app: &tauri::AppHandle, project_id: &str) -> Result<PathBuf, String> {
    validate_project_id(project_id)?;
    Ok(data_dir(app)?.join("projects").join(project_id))
}

fn weekly_script_path(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    let current_dir =
        std::env::current_dir().map_err(|error| format!("current_dir failed: {error}"))?;
    let direct_script_path = current_dir.join("scripts").join("weekly.py");

    if direct_script_path.exists() {
        return Ok(direct_script_path);
    }

    if current_dir.file_name().and_then(|name| name.to_str()) == Some("src-tauri") {
        if let Some(repo_dir) = current_dir.parent() {
            let repo_script_path = repo_dir.join("scripts").join("weekly.py");

            if repo_script_path.exists() {
                return Ok(repo_script_path);
            }
        }
    }

    let bundled_script_path = app
        .path()
        .resource_dir()
        .map_err(|error| format!("resolution dossier resources echouee: {error}"))?
        .join("scripts")
        .join("weekly.py");

    if bundled_script_path.exists() {
        Ok(bundled_script_path)
    } else {
        Err(format!(
            "script weekly.py introuvable: {}",
            bundled_script_path.display()
        ))
    }
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

fn normalize_heading_line(line: &str) -> String {
    line.trim()
        .trim_start_matches(|character| character == '#' || character == ' ')
        .trim()
        .to_string()
}

fn is_date_heading(value: &str) -> bool {
    value.len() == "2026-06-10".len()
        && value.chars().enumerate().all(|(index, character)| {
            if index == 4 || index == 7 {
                character == '-'
            } else {
                character.is_ascii_digit()
            }
        })
}

fn has_meaningful_session_content(content: &str) -> bool {
    content
        .lines()
        .map(str::trim)
        .filter(|line| !line.is_empty())
        .any(|line| {
            let heading = normalize_heading_line(line);

            if is_date_heading(&heading) {
                return false;
            }

            if EMPTY_SESSION_TEMPLATE_SECTIONS.contains(&heading.as_str()) {
                return false;
            }

            if APPRENTISSAGES_GUIDE_LINES.contains(&line) {
                return false;
            }

            !line
                .trim_start_matches(|character| character == '-' || character == '*')
                .trim()
                .is_empty()
        })
}

fn previous_week_dates_for(today: NaiveDate) -> Vec<NaiveDate> {
    let current_week_start =
        today - Duration::days(today.weekday().num_days_from_sunday() as i64);
    let previous_week_start = current_week_start - Duration::days(7);

    (0..7)
        .map(|offset| previous_week_start + Duration::days(offset))
        .collect()
}

fn previous_week_dates() -> Vec<NaiveDate> {
    previous_week_dates_for(Local::now().date_naive())
}

fn prepare_previous_week_input(project_id: &str, raw_dir: &PathBuf) -> Result<PathBuf, String> {
    prepare_week_input_for_dates(project_id, raw_dir, previous_week_dates()).map(|input| input.folder)
}

fn prepare_week_input_for_dates(
    project_id: &str,
    raw_dir: &PathBuf,
    target_dates: Vec<NaiveDate>,
) -> Result<WeeklyInput, String> {
    let mut source_files = Vec::new();

    for date in target_dates {
        let file_name = format!("{}.md", date.format("%Y-%m-%d"));
        let source_file = raw_dir.join(&file_name);

        if !source_file.exists() {
            continue;
        }

        let content = fs::read_to_string(&source_file)
            .map_err(|error| format!("lecture fichier {file_name} echouee: {error}"))?;

        if !has_meaningful_session_content(&content) {
            continue;
        }

        source_files.push((file_name, source_file));
    }

    if source_files.is_empty() {
        return Err(NO_PREVIOUS_WEEK_SESSION_MESSAGE.to_string());
    }

    let temp_dir = std::env::temp_dir().join(format!(
        "chronosvers-weekly-{}-{}",
        project_id,
        Local::now().timestamp_millis()
    ));

    fs::create_dir_all(&temp_dir)
        .map_err(|error| format!("creation dossier temporaire weekly echouee: {error}"))?;

    for (file_name, source_file) in source_files {
        fs::copy(&source_file, temp_dir.join(&file_name))
            .map_err(|error| format!("copie session {file_name} echouee: {error}"))?;
    }

    Ok(WeeklyInput { folder: temp_dir })
}

fn enrich_weekly_summary_metadata(json: &str, output_file: &PathBuf) -> Result<String, String> {
    let mut value = serde_json::from_str::<serde_json::Value>(json)
        .map_err(|error| format!("JSON weekly invalide: {error}"))?;
    let meta = value
        .get_mut("meta")
        .and_then(serde_json::Value::as_object_mut)
        .ok_or_else(|| "JSON weekly invalide: meta manquant".to_string())?;
    let session_count = meta
        .get("session_count")
        .and_then(serde_json::Value::as_u64)
        .unwrap_or(0);

    meta.insert(
        "expected_session_count".to_string(),
        serde_json::Value::from(EXPECTED_WEEKLY_SESSION_COUNT),
    );
    meta.insert(
        "is_partial".to_string(),
        serde_json::Value::from(session_count < EXPECTED_WEEKLY_SESSION_COUNT as u64),
    );

    let enriched_json = serde_json::to_string_pretty(&value)
        .map_err(|error| format!("serialisation synthese weekly echouee: {error}"))?;

    fs::write(output_file, &enriched_json)
        .map_err(|error| format!("ecriture synthese weekly enrichie echouee: {error}"))?;

    Ok(enriched_json)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn previous_week_is_sunday_to_saturday_when_today_is_sunday() {
        let today = NaiveDate::from_ymd_opt(2026, 6, 14).unwrap();
        let dates = previous_week_dates_for(today);

        assert_eq!(
            dates.first().unwrap().format("%Y-%m-%d").to_string(),
            "2026-06-07"
        );
        assert_eq!(
            dates.last().unwrap().format("%Y-%m-%d").to_string(),
            "2026-06-13"
        );
        assert_eq!(dates.len(), 7);
    }

    #[test]
    fn previous_week_input_accepts_one_meaningful_session() {
        let raw_dir = std::env::temp_dir().join(format!(
            "chronosvers-test-raw-{}",
            Local::now().timestamp_millis()
        ));
        fs::create_dir_all(&raw_dir).unwrap();
        fs::write(raw_dir.join("2026-06-07.md"), empty_session_template("2026-06-07")).unwrap();
        fs::write(
            raw_dir.join("2026-06-08.md"),
            "# 2026-06-08\n\n# ✅ Réalisé\n\n- Une vraie session de travail.\n",
        )
        .unwrap();
        let input = prepare_week_input_for_dates(
            "test",
            &raw_dir,
            previous_week_dates_for(NaiveDate::from_ymd_opt(2026, 6, 14).unwrap()),
        )
        .unwrap();

        assert!(input.folder.join("2026-06-08.md").exists());
        assert!(!input.folder.join("2026-06-07.md").exists());

        let _ = fs::remove_dir_all(input.folder);
        let _ = fs::remove_dir_all(raw_dir);
    }

    #[test]
    fn previous_week_input_blocks_without_meaningful_session() {
        let raw_dir = std::env::temp_dir().join(format!(
            "chronosvers-test-empty-{}",
            Local::now().timestamp_millis()
        ));
        fs::create_dir_all(&raw_dir).unwrap();
        fs::write(raw_dir.join("2026-06-07.md"), empty_session_template("2026-06-07")).unwrap();
        let result = prepare_week_input_for_dates(
            "test",
            &raw_dir,
            previous_week_dates_for(NaiveDate::from_ymd_opt(2026, 6, 14).unwrap()),
        );

        assert_eq!(result.err().unwrap(), NO_PREVIOUS_WEEK_SESSION_MESSAGE);

        let _ = fs::remove_dir_all(raw_dir);
    }

    #[test]
    fn previous_week_input_accepts_complete_week() {
        let raw_dir = std::env::temp_dir().join(format!(
            "chronosvers-test-full-{}",
            Local::now().timestamp_millis()
        ));
        fs::create_dir_all(&raw_dir).unwrap();

        for date in previous_week_dates_for(NaiveDate::from_ymd_opt(2026, 6, 14).unwrap()) {
            let day_id = date.format("%Y-%m-%d").to_string();
            fs::write(
                raw_dir.join(format!("{day_id}.md")),
                format!("# {day_id}\n\n# ✅ Réalisé\n\n- Travail réel du jour.\n"),
            )
            .unwrap();
        }

        let input = prepare_week_input_for_dates(
            "test",
            &raw_dir,
            previous_week_dates_for(NaiveDate::from_ymd_opt(2026, 6, 14).unwrap()),
        )
        .unwrap();
        let copied_count = fs::read_dir(&input.folder).unwrap().count();

        assert_eq!(copied_count, EXPECTED_WEEKLY_SESSION_COUNT);

        let _ = fs::remove_dir_all(input.folder);
        let _ = fs::remove_dir_all(raw_dir);
    }

    #[test]
    fn previous_week_input_accepts_three_meaningful_sessions() {
        let raw_dir = std::env::temp_dir().join(format!(
            "chronosvers-test-partial-{}",
            Local::now().timestamp_millis()
        ));
        fs::create_dir_all(&raw_dir).unwrap();

        for day_id in ["2026-06-07", "2026-06-09", "2026-06-11"] {
            fs::write(
                raw_dir.join(format!("{day_id}.md")),
                format!("# {day_id}\n\n# ✅ Réalisé\n\n- Travail réel du jour.\n"),
            )
            .unwrap();
        }

        let input = prepare_week_input_for_dates(
            "test",
            &raw_dir,
            previous_week_dates_for(NaiveDate::from_ymd_opt(2026, 6, 14).unwrap()),
        )
        .unwrap();
        let copied_count = fs::read_dir(&input.folder).unwrap().count();

        assert_eq!(copied_count, 3);

        let _ = fs::remove_dir_all(input.folder);
        let _ = fs::remove_dir_all(raw_dir);
    }
}

fn empty_session_template(day_id: &str) -> String {
    let mut content = format!("# {day_id}\n\n");

    for section in EMPTY_SESSION_TEMPLATE_SECTIONS {
        content.push_str(&format!("# {section}\n\n"));

        if section == "📚 Apprentissages" {
            content.push_str("Capacités observées aujourd'hui (optionnel) :\n\n");
            content.push_str("- Analyse\n");
            content.push_str("- Documentation\n");
            content.push_str("- Débogage\n");
            content.push_str("- Organisation\n");
            content.push_str("- Communication\n");
            content.push_str("- Créativité\n");
            content.push_str("- Recherche\n");
            content.push_str("- Résolution de problème\n\n");
            content.push_str(
                "Quelles capacités crois-tu avoir utilisées ou développées aujourd'hui ?\n\n",
            );
        }
    }

    content
}

#[tauri::command]
fn create_project_storage(app: tauri::AppHandle, project_id: String) -> Result<(), String> {
    let project_dir = project_dir(&app, &project_id)?;

    fs::create_dir_all(&project_dir)
        .map_err(|error| format!("creation dossier projet echouee: {error}"))?;

    for subdir in PROJECT_DATA_SUBDIRS {
        fs::create_dir_all(project_dir.join(subdir))
            .map_err(|error| format!("creation dossier {subdir} echouee: {error}"))?;
    }

    Ok(())
}

#[tauri::command]
fn list_project_storages(app: tauri::AppHandle) -> Result<Vec<String>, String> {
    let projects_dir = data_dir(&app)?.join("projects");

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
fn delete_project_storage(app: tauri::AppHandle, project_id: String) -> Result<(), String> {
    let project_dir = project_dir(&app, &project_id)?;

    if project_dir.exists() {
        fs::remove_dir_all(&project_dir)
            .map_err(|error| format!("suppression dossier projet echouee: {error}"))?;
    }

    Ok(())
}

#[tauri::command]
fn read_project_raw_sessions(
    app: tauri::AppHandle,
    project_id: String,
) -> Result<Vec<RawSession>, String> {
    let raw_dir = project_dir(&app, &project_id)?.join("raw");

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
fn ensure_project_raw_session(
    app: tauri::AppHandle,
    project_id: String,
    day_id: String,
) -> Result<RawSession, String> {
    validate_day_id(&day_id)?;

    let raw_dir = project_dir(&app, &project_id)?.join("raw");
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
    app: tauri::AppHandle,
    project_id: String,
    day_id: String,
    content: String,
) -> Result<RawSession, String> {
    validate_day_id(&day_id)?;

    let file_name = format!("{day_id}.md");
    let file_path = project_dir(&app, &project_id)?.join("raw").join(&file_name);

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

#[tauri::command]
fn generate_weekly_summary(app: tauri::AppHandle, project_id: String) -> Result<String, String> {
    let project_dir = project_dir(&app, &project_id)?;
    let raw_dir = project_dir.join("raw");
    let weekly_dir = project_dir.join("weekly");
    let output_file = weekly_dir.join("weekly_summary.json");

    if !raw_dir.exists() {
        return Err("dossier raw introuvable pour ce projet".to_string());
    }

    fs::create_dir_all(&weekly_dir)
        .map_err(|error| format!("creation dossier weekly echouee: {error}"))?;

    let input_folder = prepare_previous_week_input(&project_id, &raw_dir)?;
    let result = runner::run_weekly_summary(&weekly_script_path(&app)?, &input_folder, &output_file)
        .and_then(|json| enrich_weekly_summary_metadata(&json, &output_file));

    let _ = fs::remove_dir_all(&input_folder);

    result
}

#[tauri::command]
fn read_weekly_summary(app: tauri::AppHandle, project_id: String) -> Result<Option<String>, String> {
    let summary_file = project_dir(&app, &project_id)?
        .join("weekly")
        .join("weekly_summary.json");

    if !summary_file.exists() {
        return Ok(None);
    }

    let json = fs::read_to_string(&summary_file)
        .map_err(|error| format!("lecture synthese weekly echouee: {error}"))?;

    serde_json::from_str::<serde_json::Value>(&json)
        .map_err(|error| format!("JSON weekly invalide: {error}"))?;

    Ok(Some(json))
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
            generate_weekly_summary,
            read_weekly_summary,
            save_project_raw_session
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
