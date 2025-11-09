use serde::{Deserialize, Serialize};
use std::time::SystemTime;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum SourceFormat {
    Env,
    Yaml,
    Json,
    Toml,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum ExportFormat {
    Env,
    Json,
    Yaml,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum InferredType {
    String,
    Number,
    Boolean,
    Null,
    Unknown,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NormalizedEntry {
    pub key: String,
    pub value: Option<serde_json::Value>,
    pub source_file: String,
    pub source_format: SourceFormat,
    pub inferred_type: InferredType,
    pub is_secret_guess: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DiscoveredFile {
    pub path: String,
    pub format: SourceFormat,
    pub count: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Duplicate {
    pub key: String,
    pub files: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MissingKeys {
    pub file: String,
    pub missing_keys: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ParseError {
    pub file: String,
    pub message: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ScanIssues {
    pub duplicates: Vec<Duplicate>,
    pub missing_by_env_file: Vec<MissingKeys>,
    pub parse_errors: Vec<ParseError>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ScanSummary {
    pub total_files: usize,
    pub total_keys: usize,
    pub unique_keys: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ScanResult {
    pub root: String,
    pub files: Vec<DiscoveredFile>,
    pub entries: Vec<NormalizedEntry>,
    pub issues: ScanIssues,
    pub summary: ScanSummary,
}

// Cache structures for incremental scanning
#[derive(Debug, Clone)]
pub struct FileCache {
    pub modified_time: SystemTime,
    pub entries: Vec<NormalizedEntry>,
}

#[derive(Clone)]
pub struct ScanCacheState {
    // Key: file path, Value: cached file data
    // DashMap is already thread-safe, we just need to make the state cloneable via Arc
    cache: std::sync::Arc<dashmap::DashMap<String, FileCache>>,
}

impl ScanCacheState {
    pub fn new() -> Self {
        Self {
            cache: std::sync::Arc::new(dashmap::DashMap::new()),
        }
    }

    pub fn get(&self, path: &str) -> Option<FileCache> {
        self.cache.get(path).map(|entry| entry.value().clone())
    }

    pub fn insert(&self, path: String, cache_entry: FileCache) {
        self.cache.insert(path, cache_entry);
    }
}
