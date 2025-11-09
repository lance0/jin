# Changelog

All notable changes to Jin - The Config Whisperer will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Drag-and-drop folder selection
- Click-to-reveal for masked secrets
- File column show/hide toggles
- Keyboard shortcuts
- Virtual scrolling for large datasets

## [0.1.0] - 2025-01-09

### Added
- Initial MVP release 🎉
- Cross-platform desktop app (Tauri 2 + React 19 + Vite 5)
- Folder scanning with smart ignore patterns
- Multi-format config parsing:
  - `.env` and `.env.*` files
  - YAML files (`.yaml`, `.yml`) with nested object flattening
  - JSON files with nested object flattening
  - TOML files with nested table flattening
- Comprehensive issue detection:
  - Missing keys detection (per `.env` file vs union of all keys)
  - Duplicate key detection across files
  - Parse error capture and reporting
- Interactive UI components:
  - Welcome screen with folder picker
  - Issues panel with expandable accordion sections
  - Config matrix table showing key presence across files
  - Search/filter functionality for keys
  - Dark/light theme toggle
- Export functionality:
  - Generate `.env.example` file with all unique keys
  - Type hints as comments
  - Secret warnings for sensitive keys
  - Alphabetically sorted output
- Security features:
  - Secret detection heuristics (PASSWORD, TOKEN, API_KEY, etc.)
  - Value masking in UI for detected secrets
  - Strict Content Security Policy
  - Sandboxed file system access via Tauri plugins
  - No telemetry or external communication
- Developer experience:
  - Toast notifications for success/error states
  - Loading states during scanning
  - Responsive error handling
  - Clean, minimal UI design

### Technical Details
- **Frontend**: React 19, TypeScript 5.6+, Vite 5, Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Backend**: Rust with Tauri 2
- **Parsing Libraries**:
  - Rust: `serde_yaml`, `serde_json`, `toml`, `walkdir`
  - Directory traversal with smart ignores
- **Security**: CSP enforcement, plugin-based FS access, no eval/remote scripts

### Known Limitations
- No live file watching (manual rescan required)
- No custom ignore patterns (uses hardcoded list)
- Basic error messages
- No undo functionality
- Icons are placeholder (not custom hedgehog theme yet)

---

## Release Notes Template

### [Version] - YYYY-MM-DD

#### Added
- New features

#### Changed
- Changes to existing functionality

#### Deprecated
- Features to be removed in future releases

#### Removed
- Removed features

#### Fixed
- Bug fixes

#### Security
- Security improvements

---

**Note**: In loving memory of Jin the hedgehog 🦔
