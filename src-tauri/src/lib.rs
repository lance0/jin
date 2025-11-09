// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod analyzer;
mod exporter;
mod parser;
mod scanner;
mod types;
mod watcher;

use analyzer::analyze_entries;
use exporter::export_env_example;
use parser::parse_file;
use scanner::scan_directory;
use types::{ExportFormat, NormalizedEntry, ParseError, ScanResult, ScanSummary};
use watcher::{FileWatcherState, start_watching, stop_watching, get_watching_status};

#[tauri::command]
async fn scan_folder(path: String) -> Result<ScanResult, String> {
    // Step 1: Discover files
    let mut files = scan_directory(&path)?;

    // Step 2: Parse files in parallel
    let mut parse_tasks = Vec::new();
    for file in &files {
        let path_clone = path.clone();
        let file_path = file.path.clone();
        let file_format = file.format.clone();

        parse_tasks.push(tokio::spawn(async move {
            parse_file(&path_clone, &file_path, &file_format).await
        }));
    }

    // Wait for all parse tasks to complete
    let mut all_entries: Vec<NormalizedEntry> = Vec::new();
    let mut parse_errors: Vec<ParseError> = Vec::new();

    for (idx, task) in parse_tasks.into_iter().enumerate() {
        match task.await {
            Ok(Ok(entries)) => {
                files[idx].count = entries.len();
                all_entries.extend(entries);
            }
            Ok(Err(err)) => {
                parse_errors.push(err);
            }
            Err(e) => {
                parse_errors.push(ParseError {
                    file: files[idx].path.clone(),
                    message: format!("Task failed: {}", e),
                });
            }
        }
    }

    // Step 3: Analyze for issues
    let mut issues = analyze_entries(&all_entries);
    issues.parse_errors = parse_errors;

    // Step 4: Generate summary
    let unique_keys: std::collections::HashSet<String> =
        all_entries.iter().map(|e| e.key.clone()).collect();

    let summary = ScanSummary {
        total_files: files.len(),
        total_keys: all_entries.len(),
        unique_keys: unique_keys.len(),
    };

    Ok(ScanResult {
        root: path,
        files,
        entries: all_entries,
        issues,
        summary,
    })
}

#[tauri::command]
async fn export_env_example_cmd(output_path: String, entries: Vec<NormalizedEntry>, format: ExportFormat) -> Result<String, String> {
    export_env_example(&output_path, &entries, format).await
}

#[tauri::command]
fn start_file_watching(
    app_handle: tauri::AppHandle,
    path: String,
    state: tauri::State<'_, FileWatcherState>,
) -> Result<(), String> {
    start_watching(app_handle, path, state)
}

#[tauri::command]
fn stop_file_watching(state: tauri::State<'_, FileWatcherState>) -> Result<(), String> {
    stop_watching(state)
}

#[tauri::command]
fn get_file_watching_status(state: tauri::State<'_, FileWatcherState>) -> (bool, Option<String>) {
    get_watching_status(state)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .manage(FileWatcherState::new())
        .invoke_handler(tauri::generate_handler![
            scan_folder,
            export_env_example_cmd,
            start_file_watching,
            stop_file_watching,
            get_file_watching_status
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
