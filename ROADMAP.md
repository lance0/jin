# Jin Roadmap

## ✅ Phase 1: MVP (Completed - v0.1.0)

### Core Functionality
- [x] Tauri 2 + React 19 + Vite 5 setup
- [x] Folder scanning with ignore patterns (node_modules, .git, dist, etc.)
- [x] Multi-format parsing:
  - [x] .env files
  - [x] YAML files (with nested flattening)
  - [x] JSON files (with nested flattening)
  - [x] TOML files (with nested flattening)
- [x] Issue detection:
  - [x] Missing keys (per .env file)
  - [x] Duplicate keys across files
  - [x] Parse errors
- [x] Export .env.example with type hints
- [x] Secret detection and masking

### UI/UX
- [x] Welcome screen with folder picker
- [x] Main workspace with 3-pane layout
- [x] Issues panel with accordion sections
- [x] Config matrix table with key/file visualization
- [x] Search and filter functionality
- [x] Dark/light theme toggle
- [x] Toast notifications
- [x] Loading states

### Security & Performance
- [x] Strict CSP configuration
- [x] Tauri FS/Dialog plugin sandboxing
- [x] No telemetry - all local processing
- [x] Secret value masking with click-to-reveal

---

## ✅ Phase 2: Enhancement & Performance (Completed - v1.0.0)

### Performance ✅ COMPLETED
- [x] Async backend with Tokio runtime
- [x] Parallel file processing
- [x] Non-blocking file I/O
- [x] React performance optimization (memo, useCallback, useMemo)
- [x] Zustand state subscription optimization
- [x] Remove expensive CSS transitions
- [x] Instant theme switching
- [x] Semaphore-based concurrency limiting (16 concurrent file operations)
- [x] In-memory file caching with modification time tracking
- [x] Performance warning for large datasets (200+ keys)
- [x] CSS performance optimizations (will-change hints)

### UI Improvements ✅ COMPLETED
- [x] Rescan button (completed)
- [x] Click-to-reveal for secrets (completed)
- [x] Folder selection UI (completed)
- [x] File column show/hide toggles (completed)
- [x] Keyboard shortcuts (Cmd/Ctrl+O, Cmd/Ctrl+E, Cmd/Ctrl+R) (completed)
- [x] Add app icon (hedgehog theme) (completed)
- [x] About modal with Jin memorial (completed)

### Functionality ✅ COMPLETED
- [x] Export location chooser (not just project root) (completed)
- [x] Copy individual values to clipboard (completed)
- [x] Export to different formats (JSON, YAML) (completed)

### Polish ✅ COMPLETED
- [x] Better error messages (completed)
- [x] Celebration message for no issues (completed)
- [x] Loading skeleton UI (completed)
- [x] Copy all values from file button (completed)
- [x] Empty state illustrations (completed)
- [x] Onboarding tour (completed)
- [x] Toast close buttons (completed)
- [x] Comprehensive tooltips on all interactive elements (completed)
- [x] Updated onboarding tour with file watching (completed)
- [x] Mobile responsiveness (completed)

---

## 🔮 Phase 3: Advanced Features (In Progress)

### Live Watching ✅ COMPLETED
- [x] File watcher integration (completed)
- [x] Auto-rescan on file changes (completed)
- [x] Change notifications (completed)
- [x] Debounced updates (completed)

### Analysis
- [ ] Two-file diff view (side-by-side comparison)
- [ ] Historical tracking of config changes
- [ ] Suggested fixes for issues
- [ ] Auto-merge configs

### Validation
- [ ] JSON Schema validation for config.json/yaml
- [ ] Custom validation rules
- [ ] Environment-specific validation
- [ ] Required vs optional key marking

### Performance
- [x] Async file I/O (completed in Phase 2)
- [x] Parallel file processing (completed in Phase 2)
- [x] Semaphore-based concurrency limiting (completed in Phase 2)
- [x] In-memory caching with modification time tracking (completed in Phase 2)
- [ ] Virtual scrolling for 500+ keys (planned for v0.2.0 - currently handled with warning banner)
- [ ] Incremental parsing for large files
- [ ] Disk-persisted cache between app launches

### Extensibility
- [ ] Plugin system for custom parsers
- [ ] Custom export templates
- [ ] Scripting support (JavaScript API)
- [ ] CLI companion tool

---

## 📦 Phase 4: Distribution & Collaboration (In Progress)

### Distribution
- [x] Production build configuration (completed)
- [x] Code signing setup (completed - placeholders in place)
- [x] DMG installer for macOS (completed)
- [x] Windows MSI/NSIS installers (completed)
- [x] Linux DEB and AppImage (completed)
- [x] Distribution documentation (completed)
- [ ] Auto-update mechanism
- [ ] Notarization automation (macOS)
- [ ] Homebrew formula

### Team Features
- [ ] Config sharing (optional cloud sync)
- [ ] Team templates
- [ ] Audit logs
- [ ] Comments on keys

### Documentation
- [ ] Video tutorials
- [ ] Interactive docs
- [ ] Best practices guide
- [ ] Migration guides

---

## 🎯 Success Metrics

### MVP Goals (Achieved)
- ✅ Builds on macOS
- ✅ Scans folder and discovers config files
- ✅ Parses .env, YAML, JSON, TOML
- ✅ Detects missing keys, duplicates, parse errors
- ✅ Displays issues in UI
- ✅ Shows key×file matrix
- ✅ Exports working `.env.example`
- ✅ Basic error handling

### Phase 2 Goals
- ✅ Scan <3s for 2k files
- ✅ Zero crashes in normal usage
- 95%+ test coverage (pending)
- ✅ Responsive on mobile

### Long-term Goals
- 10k+ users
- <0.1% crash rate
- Plugin ecosystem
- Community contributions

---

## Notes

**Memorial**: Dedicated to Jin the hedgehog 🦔

**Philosophy**:
- Local-first: All processing happens on device
- Privacy: No telemetry, no tracking
- Speed: Sub-second scans for typical projects
- Simplicity: One-click export, minimal configuration
