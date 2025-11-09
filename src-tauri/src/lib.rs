// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod analyzer;
mod exporter;
mod parser;
mod scanner;
mod types;

use analyzer::analyze_entries;
use exporter::export_env_example;
use parser::parse_file;
use scanner::scan_directory;
use types::{NormalizedEntry, ParseError, ScanResult, ScanSummary};

#[tauri::command]
fn scan_folder(path: String) -> Result<ScanResult, String> {
    // Step 1: Discover files
    let mut files = scan_directory(&path)?;

    // Step 2: Parse each file
    let mut all_entries: Vec<NormalizedEntry> = Vec::new();
    let mut parse_errors: Vec<ParseError> = Vec::new();

    for file in &mut files {
        match parse_file(&path, &file.path, &file.format) {
            Ok(entries) => {
                file.count = entries.len();
                all_entries.extend(entries);
            }
            Err(err) => {
                parse_errors.push(err);
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
fn export_env_example_cmd(path: String, entries: Vec<NormalizedEntry>) -> Result<String, String> {
    export_env_example(&path, &entries)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![scan_folder, export_env_example_cmd])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
