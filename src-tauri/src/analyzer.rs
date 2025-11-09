use std::collections::{HashMap, HashSet};

use crate::types::{Duplicate, MissingKeys, NormalizedEntry, ScanIssues, SourceFormat};

pub fn analyze_entries(entries: &[NormalizedEntry]) -> ScanIssues {
    let duplicates = find_duplicates(entries);
    let missing_by_env_file = find_missing_keys(entries);

    ScanIssues {
        duplicates,
        missing_by_env_file,
        parse_errors: Vec::new(), // Parse errors are collected during parsing
    }
}

fn find_duplicates(entries: &[NormalizedEntry]) -> Vec<Duplicate> {
    let mut key_files: HashMap<String, HashSet<String>> = HashMap::new();

    for entry in entries {
        key_files
            .entry(entry.key.clone())
            .or_insert_with(HashSet::new)
            .insert(entry.source_file.clone());
    }

    key_files
        .into_iter()
        .filter(|(_, files)| files.len() > 1)
        .map(|(key, files)| Duplicate {
            key,
            files: files.into_iter().collect(),
        })
        .collect()
}

fn find_missing_keys(entries: &[NormalizedEntry]) -> Vec<MissingKeys> {
    // Get all unique keys
    let all_keys: HashSet<String> = entries.iter().map(|e| e.key.clone()).collect();

    // Get all env files
    let env_files: HashSet<String> = entries
        .iter()
        .filter(|e| matches!(e.source_format, SourceFormat::Env))
        .map(|e| e.source_file.clone())
        .collect();

    let mut result = Vec::new();

    for env_file in env_files {
        // Get keys present in this file
        let file_keys: HashSet<String> = entries
            .iter()
            .filter(|e| e.source_file == env_file)
            .map(|e| e.key.clone())
            .collect();

        // Find missing keys
        let missing: Vec<String> = all_keys
            .difference(&file_keys)
            .cloned()
            .collect::<Vec<_>>();

        if !missing.is_empty() {
            result.push(MissingKeys {
                file: env_file,
                missing_keys: missing,
            });
        }
    }

    result
}
