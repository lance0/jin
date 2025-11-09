use std::collections::HashMap;
use std::path::{Path, PathBuf};
use walkdir::{DirEntry, WalkDir};

use crate::types::{DiscoveredFile, SourceFormat};

const IGNORE_DIRS: &[&str] = &[
    "node_modules",
    ".git",
    "dist",
    "build",
    "target",
    "venv",
    "__pycache__",
    ".next",
    ".nuxt",
    "coverage",
    ".cache",
];

pub fn scan_directory(root_path: &str) -> Result<Vec<DiscoveredFile>, String> {
    let root = Path::new(root_path);

    if !root.exists() {
        return Err(format!("Path does not exist: {}", root_path));
    }

    if !root.is_dir() {
        return Err(format!("Path is not a directory: {}", root_path));
    }

    let mut discovered: HashMap<PathBuf, SourceFormat> = HashMap::new();

    for entry in WalkDir::new(root)
        .follow_links(false)
        .into_iter()
        .filter_entry(|e| !is_ignored(e))
    {
        match entry {
            Ok(entry) => {
                if entry.file_type().is_file() {
                    if let Some(format) = detect_format(&entry) {
                        let relative_path = entry
                            .path()
                            .strip_prefix(root)
                            .unwrap_or(entry.path())
                            .to_path_buf();
                        discovered.insert(relative_path, format);
                    }
                }
            }
            Err(e) => {
                eprintln!("Warning: Failed to read entry: {}", e);
            }
        }
    }

    // Convert to DiscoveredFile with placeholder counts
    let files: Vec<DiscoveredFile> = discovered
        .into_iter()
        .map(|(path, format)| DiscoveredFile {
            path: path.to_string_lossy().to_string(),
            format,
            count: 0, // Will be filled in by parser
        })
        .collect();

    Ok(files)
}

fn is_ignored(entry: &DirEntry) -> bool {
    entry
        .file_name()
        .to_str()
        .map(|s| IGNORE_DIRS.contains(&s))
        .unwrap_or(false)
}

fn detect_format(entry: &DirEntry) -> Option<SourceFormat> {
    let file_name = entry.file_name().to_str()?;
    let path = entry.path();

    // Check for .env files
    if file_name.starts_with(".env") {
        return Some(SourceFormat::Env);
    }

    // Check by extension
    if let Some(ext) = path.extension().and_then(|e| e.to_str()) {
        match ext.to_lowercase().as_str() {
            "yaml" | "yml" => return Some(SourceFormat::Yaml),
            "json" => return Some(SourceFormat::Json),
            "toml" => return Some(SourceFormat::Toml),
            _ => {}
        }
    }

    None
}
