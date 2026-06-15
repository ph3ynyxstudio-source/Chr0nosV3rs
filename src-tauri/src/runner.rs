use std::{
    path::Path,
    process::{Command, Stdio},
};

const PYTHON_COMMANDS: [&str; 3] = ["python", "python3", "py"];

pub fn run_weekly_summary(
    script_path: &Path,
    input_folder: &Path,
    output_file: &Path,
) -> Result<String, String> {
    let mut last_error = String::from("aucune commande Python disponible");

    for python_command in PYTHON_COMMANDS {
        let output = Command::new(python_command)
            .arg(script_path)
            .arg(input_folder)
            .arg(output_file)
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .output();

        match output {
            Ok(output) if output.status.success() => {
                let json = std::fs::read_to_string(output_file)
                    .map_err(|error| format!("lecture synthese weekly echouee: {error}"))?;

                serde_json::from_str::<serde_json::Value>(&json)
                    .map_err(|error| format!("JSON weekly invalide: {error}"))?;

                return Ok(json);
            }
            Ok(output) => {
                let stderr = String::from_utf8_lossy(&output.stderr);
                let stdout = String::from_utf8_lossy(&output.stdout);
                last_error = format!(
                    "{python_command} a echoue avec le statut {}. stderr: {} stdout: {}",
                    output.status,
                    stderr.trim(),
                    stdout.trim()
                );
            }
            Err(error) => {
                last_error = format!("{python_command} indisponible: {error}");
            }
        }
    }

    Err(format!("generation weekly Python echouee: {last_error}"))
}
