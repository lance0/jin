# Jin Roadmap

## ✅ Phase 1: MVP (Completed - Weekend 1)

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

## 🚧 Phase 2: Enhancement (Week 2)

### UI Improvements
- [ ] Drag-and-drop folder selection
- [ ] File column show/hide toggles
- [ ] Responsive mobile layout improvements
- [ ] Add app icon (hedgehog theme)
- [ ] Splash screen / about modal
- [ ] Keyboard shortcuts (Cmd/Ctrl+O, Cmd/Ctrl+E, F for search)

### Functionality
- [ ] Rescan button with debounce
- [ ] Export location chooser (not just project root)
- [ ] Copy individual values to clipboard
- [ ] Export to different formats (JSON, YAML)
- [ ] Custom ignore patterns (user-defined)

### Polish
- [ ] Animated transitions
- [ ] Better error messages
- [ ] Empty state illustrations
- [ ] Success/error states with animations
- [ ] Onboarding tour

---

## 🔮 Phase 3: Advanced Features (Future)

### Live Watching
- [ ] File watcher integration
- [ ] Auto-rescan on file changes
- [ ] Change notifications
- [ ] Debounced updates

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
- [ ] Virtual scrolling for 500+ keys
- [ ] Incremental parsing for large files
- [ ] Background scanning
- [ ] Cache scan results

### Extensibility
- [ ] Plugin system for custom parsers
- [ ] Custom export templates
- [ ] Scripting support (JavaScript API)
- [ ] CLI companion tool

---

## 📦 Phase 4: Distribution & Collaboration

### Distribution
- [ ] Auto-update mechanism
- [ ] Code signing
- [ ] Notarization (macOS)
- [ ] Windows installer
- [ ] Linux AppImage/Flatpak
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
- Scan <3s for 2k files
- Zero crashes in normal usage
- 95%+ test coverage
- Responsive on mobile

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
