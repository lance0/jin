use notify_debouncer_full::{
    new_debouncer,
    notify::{RecursiveMode, Watcher},
    DebounceEventResult, Debouncer, FileIdMap,
};
use std::path::Path;
use std::sync::{Arc, Mutex};
use std::time::Duration;
use tauri::{AppHandle, Emitter};

pub struct FileWatcherState {
    pub debouncer: Arc<Mutex<Option<Debouncer<notify::RecommendedWatcher, FileIdMap>>>>,
    pub watching_path: Arc<Mutex<Option<String>>>,
}

impl FileWatcherState {
    pub fn new() -> Self {
        Self {
            debouncer: Arc::new(Mutex::new(None)),
            watching_path: Arc::new(Mutex::new(None)),
        }
    }
}

pub fn start_watching(
    app_handle: AppHandle,
    path: String,
    state: tauri::State<'_, FileWatcherState>,
) -> Result<(), String> {
    // Stop any existing watcher first
    stop_watching(state.clone())?;

    let path_clone = path.clone();
    let app_handle_clone = app_handle.clone();

    // Create debouncer with 1 second delay
    let mut debouncer = new_debouncer(
        Duration::from_secs(1),
        None,
        move |result: DebounceEventResult| {
            match result {
                Ok(events) => {
                    // Check if any of the events are for config files we care about
                    let has_relevant_change = events.iter().any(|event| {
                        event.paths.iter().any(|path| {
                            let path_str = path.to_string_lossy();
                            path_str.contains(".env")
                                || path_str.ends_with(".yaml")
                                || path_str.ends_with(".yml")
                                || path_str.ends_with(".json")
                                || path_str.ends_with(".toml")
                        })
                    });

                    if has_relevant_change {
                        // Emit event to frontend
                        let _ = app_handle_clone.emit("config-files-changed", ());
                    }
                }
                Err(errors) => {
                    eprintln!("File watcher error: {:?}", errors);
                }
            }
        },
    )
    .map_err(|e| format!("Failed to create file watcher: {}", e))?;

    // Watch the directory recursively
    debouncer
        .watcher()
        .watch(Path::new(&path), RecursiveMode::Recursive)
        .map_err(|e| format!("Failed to watch directory: {}", e))?;

    // Store the debouncer and path
    *state.debouncer.lock().unwrap() = Some(debouncer);
    *state.watching_path.lock().unwrap() = Some(path_clone);

    Ok(())
}

pub fn stop_watching(state: tauri::State<'_, FileWatcherState>) -> Result<(), String> {
    let mut debouncer_guard = state.debouncer.lock().unwrap();
    *debouncer_guard = None;
    *state.watching_path.lock().unwrap() = None;
    Ok(())
}

pub fn get_watching_status(state: tauri::State<'_, FileWatcherState>) -> (bool, Option<String>) {
    let is_watching = state.debouncer.lock().unwrap().is_some();
    let path = state.watching_path.lock().unwrap().clone();
    (is_watching, path)
}
