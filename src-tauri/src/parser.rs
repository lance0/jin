use std::collections::HashMap;
use std::path::Path;

use crate::types::{InferredType, NormalizedEntry, ParseError, SourceFormat};

pub async fn parse_file(
    root_path: &str,
    relative_path: &str,
    format: &SourceFormat,
) -> Result<Vec<NormalizedEntry>, ParseError> {
    let full_path = Path::new(root_path).join(relative_path);

    let content = tokio::fs::read_to_string(&full_path).await.map_err(|e| ParseError {
        file: relative_path.to_string(),
        message: format!("Failed to read file: {}", e),
    })?;

    match format {
        SourceFormat::Env => parse_env(&content, relative_path),
        SourceFormat::Yaml => parse_yaml(&content, relative_path),
        SourceFormat::Json => parse_json(&content, relative_path),
        SourceFormat::Toml => parse_toml(&content, relative_path),
    }
}

fn parse_env(content: &str, file_path: &str) -> Result<Vec<NormalizedEntry>, ParseError> {
    let mut entries = Vec::new();

    for (_idx, line) in content.lines().enumerate() {
        let line = line.trim();

        // Skip empty lines and comments
        if line.is_empty() || line.starts_with('#') {
            continue;
        }

        // Simple key=value parsing
        if let Some((key, value)) = line.split_once('=') {
            let key = key.trim().to_string();
            let value_str = value.trim().trim_matches('"').trim_matches('\'').to_string();
            let value_json = serde_json::Value::String(value_str);

            entries.push(create_entry(
                key,
                value_json,
                file_path.to_string(),
                SourceFormat::Env,
            ));
        }
    }

    Ok(entries)
}

fn parse_yaml(content: &str, file_path: &str) -> Result<Vec<NormalizedEntry>, ParseError> {
    let yaml_value: serde_yaml::Value = serde_yaml::from_str(content).map_err(|e| ParseError {
        file: file_path.to_string(),
        message: format!("YAML parse error: {}", e),
    })?;

    let flattened = flatten_value("", &yaml_value);
    let entries = flattened
        .into_iter()
        .map(|(key, value)| create_entry(key, value, file_path.to_string(), SourceFormat::Yaml))
        .collect();

    Ok(entries)
}

fn parse_json(content: &str, file_path: &str) -> Result<Vec<NormalizedEntry>, ParseError> {
    let json_value: serde_json::Value = serde_json::from_str(content).map_err(|e| ParseError {
        file: file_path.to_string(),
        message: format!("JSON parse error: {}", e),
    })?;

    let flattened = flatten_json_value("", &json_value);
    let entries = flattened
        .into_iter()
        .map(|(key, value)| create_entry(key, value, file_path.to_string(), SourceFormat::Json))
        .collect();

    Ok(entries)
}

fn parse_toml(content: &str, file_path: &str) -> Result<Vec<NormalizedEntry>, ParseError> {
    let toml_value: toml::Value = toml::from_str(content).map_err(|e| ParseError {
        file: file_path.to_string(),
        message: format!("TOML parse error: {}", e),
    })?;

    let flattened = flatten_toml_value("", &toml_value);
    let entries = flattened
        .into_iter()
        .map(|(key, value)| create_entry(key, value, file_path.to_string(), SourceFormat::Toml))
        .collect();

    Ok(entries)
}

// Flatten YAML value recursively
fn flatten_value(prefix: &str, value: &serde_yaml::Value) -> HashMap<String, serde_json::Value> {
    let mut result = HashMap::new();

    match value {
        serde_yaml::Value::Mapping(map) => {
            for (k, v) in map {
                if let Some(key_str) = k.as_str() {
                    let new_key = if prefix.is_empty() {
                        key_str.to_string()
                    } else {
                        format!("{}.{}", prefix, key_str)
                    };

                    if let serde_yaml::Value::Mapping(_) = v {
                        result.extend(flatten_value(&new_key, v));
                    } else {
                        // Convert YAML value to JSON value
                        let json_val = yaml_to_json(v);
                        result.insert(new_key, json_val);
                    }
                }
            }
        }
        _ => {
            if !prefix.is_empty() {
                result.insert(prefix.to_string(), yaml_to_json(value));
            }
        }
    }

    result
}

// Flatten JSON value recursively
fn flatten_json_value(prefix: &str, value: &serde_json::Value) -> HashMap<String, serde_json::Value> {
    let mut result = HashMap::new();

    match value {
        serde_json::Value::Object(map) => {
            for (k, v) in map {
                let new_key = if prefix.is_empty() {
                    k.clone()
                } else {
                    format!("{}.{}", prefix, k)
                };

                if v.is_object() {
                    result.extend(flatten_json_value(&new_key, v));
                } else {
                    result.insert(new_key, v.clone());
                }
            }
        }
        _ => {
            if !prefix.is_empty() {
                result.insert(prefix.to_string(), value.clone());
            }
        }
    }

    result
}

// Flatten TOML value recursively
fn flatten_toml_value(prefix: &str, value: &toml::Value) -> HashMap<String, serde_json::Value> {
    let mut result = HashMap::new();

    match value {
        toml::Value::Table(map) => {
            for (k, v) in map {
                let new_key = if prefix.is_empty() {
                    k.clone()
                } else {
                    format!("{}.{}", prefix, k)
                };

                if matches!(v, toml::Value::Table(_)) {
                    result.extend(flatten_toml_value(&new_key, v));
                } else {
                    result.insert(new_key, toml_to_json(v));
                }
            }
        }
        _ => {
            if !prefix.is_empty() {
                result.insert(prefix.to_string(), toml_to_json(value));
            }
        }
    }

    result
}

// Helper to convert YAML to JSON
fn yaml_to_json(value: &serde_yaml::Value) -> serde_json::Value {
    match value {
        serde_yaml::Value::Null => serde_json::Value::Null,
        serde_yaml::Value::Bool(b) => serde_json::Value::Bool(*b),
        serde_yaml::Value::Number(n) => {
            if let Some(i) = n.as_i64() {
                serde_json::Value::Number(i.into())
            } else if let Some(f) = n.as_f64() {
                serde_json::Value::Number(
                    serde_json::Number::from_f64(f).unwrap_or(serde_json::Number::from(0)),
                )
            } else {
                serde_json::Value::Null
            }
        }
        serde_yaml::Value::String(s) => serde_json::Value::String(s.clone()),
        _ => serde_json::Value::String(format!("{:?}", value)),
    }
}

// Helper to convert TOML to JSON
fn toml_to_json(value: &toml::Value) -> serde_json::Value {
    match value {
        toml::Value::String(s) => serde_json::Value::String(s.clone()),
        toml::Value::Integer(i) => serde_json::Value::Number((*i).into()),
        toml::Value::Float(f) => {
            serde_json::Value::Number(serde_json::Number::from_f64(*f).unwrap_or(0.into()))
        }
        toml::Value::Boolean(b) => serde_json::Value::Bool(*b),
        toml::Value::Datetime(dt) => serde_json::Value::String(dt.to_string()),
        toml::Value::Array(arr) => {
            serde_json::Value::Array(arr.iter().map(toml_to_json).collect())
        }
        _ => serde_json::Value::Null,
    }
}

fn create_entry(
    key: String,
    value: serde_json::Value,
    source_file: String,
    source_format: SourceFormat,
) -> NormalizedEntry {
    let (inferred_type, is_secret_guess) = infer_type_and_secret(&key, &value);

    NormalizedEntry {
        key,
        value: Some(value),
        source_file,
        source_format,
        inferred_type,
        is_secret_guess: Some(is_secret_guess),
    }
}

fn infer_type_and_secret(key: &str, value: &serde_json::Value) -> (InferredType, bool) {
    let inferred_type = match value {
        serde_json::Value::Null => InferredType::Null,
        serde_json::Value::Bool(_) => InferredType::Boolean,
        serde_json::Value::Number(_) => InferredType::Number,
        serde_json::Value::String(_) => InferredType::String,
        _ => InferredType::Unknown,
    };

    // Check if it's likely a secret
    let key_upper = key.to_uppercase();
    let is_secret = key_upper.contains("SECRET")
        || key_upper.contains("PASSWORD")
        || key_upper.contains("TOKEN")
        || key_upper.contains("API_KEY")
        || key_upper.contains("PRIVATE_KEY")
        || key_upper.contains("CREDENTIALS");

    (inferred_type, is_secret)
}
