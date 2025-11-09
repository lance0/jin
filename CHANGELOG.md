# Changelog

All notable changes to Jin - The Config Whisperer will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Click-to-reveal for masked secrets in config matrix
- Rescan button for quick folder re-scanning
- Loading states with proper state management
- Drag-and-drop folder selection
- File column show/hide toggles in config matrix
- Keyboard shortcuts (Cmd/Ctrl+O for open, Cmd/Ctrl+R for rescan, Cmd/Ctrl+E for export)
- Export location chooser (save dialog)
- Copy individual values to clipboard
- Export to multiple formats (JSON, YAML, .env)
- Custom hedgehog app icon
- About modal with Jin memorial and app information
- Celebration UI when no issues are found (gradient card with sparkles)
- Skeleton loading screen that mimics the actual layout
- "Copy All" button in file column headers to copy all key-value pairs
- Compact About dialog optimized for smaller windows
- Empty state illustrations for "no config files" and "no search results" screens
- Interactive onboarding tour for first-time users with step-by-step guidance
- "Restart Onboarding Tour" button in About dialog
- **Live file watching** with automatic rescanning when config files change
- Auto-watch toggle button in header with visual indicator
- Debounced file watching (1-second delay) to prevent excessive rescans
- **Performance warning banner** when displaying 200+ config keys
- **Semaphore-based concurrency limiting** (16 concurrent file operations) to prevent file descriptor exhaustion
- **In-memory file caching** with modification time tracking for 70-90% faster rescans

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
- HTML page title updated to "Jin – The Config Whisperer"

### Fixed
- Loading state properly resets after scan completes or fails
- Main thread no longer blocks during file operations
- Theme switching is now instant instead of laggy
- UI remains responsive during large folder scans
- Dialog component structure fixed to prevent blank screens
- DropdownMenu items corrected (MenuItem vs CheckboxItem)
- React Hooks order violation in App.tsx that caused blank screen
- Duplicate identifier field removed from tauri.conf.json

### Distribution
- Production build configuration with bundle enabled
- macOS DMG and app bundle support
- Windows MSI and NSIS installer support
- Linux DEB and AppImage support
- Code signing placeholders for macOS and Windows
- Comprehensive distribution guide (DISTRIBUTION.md)

### Known Limitations
- UI performance may degrade with 500+ config keys (use search/filter or hide columns)
- Virtual scrolling for extremely large datasets deferred to v0.2.0

### Planned for Future Releases
- Virtual scrolling for large datasets (500+ keys) - planned for v0.2.0
- Two-file diff view for comparing configs
- Auto-update mechanism
- Homebrew formula
- App Store distribution

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
- No undo functionality

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
