# Changelog

All notable changes to Jin - The Config Whisperer will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Click-to-reveal for masked secrets in config matrix
- Rescan button for quick folder re-scanning
- Loading states with proper state management

### Changed
- **MAJOR PERFORMANCE IMPROVEMENTS**: Theme switching and overall responsiveness drastically improved
- Converted Rust backend to async operations with Tokio
- Implemented parallel file processing using tokio::spawn
- Replaced blocking file I/O with async tokio::fs operations
- Fixed Zustand state subscriptions to prevent unnecessary re-renders
- Added React.memo to all components
- Added useCallback and useMemo optimizations throughout
- Removed expensive CSS transitions from table elements (hundreds of cells)
- Removed gradient text effects and backdrop-blur for better performance
- Optimized ConfigMatrix component to eliminate animation overhead

### Fixed
- Loading state properly resets after scan completes or fails
- Main thread no longer blocks during file operations
- Theme switching is now instant instead of laggy
- UI remains responsive during large folder scans

### Planned
- Drag-and-drop folder selection
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
