# 🦔 Jin - The Config Whisperer

> **Tame your .envs, calm your configs**

Jin is a cross-platform desktop application that scans your project for configuration files, normalizes keys, highlights issues, and helps you maintain clean, consistent config files across your codebase.

**In loving memory of Jin the hedgehog** 🦔

---

## ✨ Features

### 🔍 **Smart Scanning**
- Recursively scans your chosen folder for config files
- Automatically detects `.env`, `.yaml`, `.json`, and `.toml` files
- Ignores common directories (`node_modules`, `.git`, `dist`, etc.)
- Handles nested objects by flattening to dot-notation

### 🔐 **Secret Detection**
- Automatically identifies sensitive values (passwords, tokens, API keys)
- Masks secrets in the UI for privacy
- Click-to-reveal individual secret values with eye icon
- Copy individual values to clipboard
- Warns about sensitive keys in exported files

### 🚨 **Issue Detection**
- **Missing Keys**: Shows which keys are missing from each `.env` file
- **Duplicates**: Identifies keys that appear in multiple files
- **Parse Errors**: Catches and reports malformed config files

### 📊 **Visual Matrix**
- See all keys and their presence across files at a glance
- Search and filter keys in real-time
- Show/hide individual file columns
- Copy individual values or entire file configs
- View values with type inference (string, number, boolean, null)
- Responsive table with optimized performance

### 📤 **Export Clean Configs**
- Export to multiple formats: `.env`, `JSON`, or `YAML`
- Choose save location with file picker
- Includes type hints as comments (.env format)
- Alphabetically sorted keys
- Blank values ready for your team to fill in

### 🎨 **Polished UI**
- Dark and light themes with instant switching
- Smooth animations and transitions
- Toast notifications for all actions
- Comprehensive keyboard shortcuts (⌘O, ⌘R, ⌘E)
- Interactive onboarding tour for new users
- Empty state illustrations
- Skeleton loading screens
- Fully responsive design

### 👁️ **Live File Watching**
- Toggle auto-watch to monitor config files for changes
- Automatic rescanning when files are modified
- Debounced updates (1-second delay)
- Visual indicator when watching is active
- Notifications when changes are detected

---

## 🚀 Quick Start

### Prerequisites
- **macOS**: 11+ (Big Sur or later)
- **Windows**: 10+ (coming soon)
- **Linux**: Ubuntu 20.04+ (coming soon)

### Installation

#### Option 1: Download Release (Recommended)

Download the latest release for your platform:
- **macOS**: Download `.dmg` installer from [Releases](https://github.com/yourusername/jin/releases)
- **Windows**: Download `.msi` or `.exe` installer (coming soon)
- **Linux**: Download `.deb` or `.AppImage` (coming soon)

#### Option 2: Build from Source

**Requirements:**
- Node.js 18+ and npm
- Rust 1.70+

**Steps:**
```bash
# Clone the repository
git clone https://github.com/yourusername/jin.git
cd jin/jin-tauri

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production (creates installers)
npm run tauri build
```

Built installers will be in `src-tauri/target/release/bundle/`

---

## 📖 Usage

### 1. Choose a Project Folder
- Click **"Choose a project folder"** on the welcome screen
- Or use keyboard shortcut: **⌘O** (Mac) / **Ctrl+O** (Windows/Linux)
- Drag and drop folder into the app window

### 2. Review Issues
- Check the **Issues Panel** on the left for:
  - Missing keys in `.env` files
  - Duplicate keys across files
  - Parse errors
- Celebrate when you see "All Clear!" 🎉

### 3. Inspect the Matrix
- Use the **Config Matrix** to see which keys exist in which files
- **Search** for specific keys in the search bar
- **Toggle columns** to show/hide specific config files
- **Click eye icon** to reveal masked secret values
- **Click copy icon** to copy individual values
- **Copy all** values from a file using the header button

### 4. Enable Auto-Watch (Optional)
- Click the **eye icon** in the header to enable file watching
- Jin will automatically rescan when config files change
- Green pulsing dot indicates watching is active

### 5. Export Template
- Click **"Export Template"** in the footer
- Select format: `.env`, `JSON`, or `YAML`
- Choose save location
- Share with your team!

### Keyboard Shortcuts
- **⌘O / Ctrl+O**: Open folder picker
- **⌘R / Ctrl+R**: Rescan current project
- **⌘E / Ctrl+E**: Export template

---

## 🏗️ Tech Stack

### Frontend
- **React 19**: UI library
- **Vite 5**: Build tool
- **TypeScript 5.6+**: Type safety
- **Tailwind CSS**: Styling
- **Zustand**: State management
- **Lucide React**: Icons
- **Sonner**: Toast notifications

### Backend
- **Tauri 2**: Desktop framework
- **Rust**: Native backend with async/await (Tokio)
- **notify**: File system watching with debouncing
- **walkdir**: Directory traversal
- **serde**: Serialization
- **YAML/JSON/TOML parsers**: Multi-format support

---

## 🔒 Security & Privacy

Jin is built with **privacy-first principles**:

✅ **All processing is local** - nothing leaves your machine
✅ **No telemetry or tracking**
✅ **Strict Content Security Policy**
✅ **Sandboxed file system access**
✅ **Secrets are masked by default**
✅ **No eval(), no remote scripts**

---

## 📁 Project Structure

```
jin-tauri/
├── src/                    # React frontend
│   ├── components/         # UI components
│   │   ├── WelcomeScreen.tsx
│   │   ├── Header.tsx
│   │   ├── IssuesPanel.tsx
│   │   ├── ConfigMatrix.tsx
│   │   ├── Footer.tsx
│   │   ├── AboutDialog.tsx
│   │   └── OnboardingTour.tsx
│   ├── store/              # Zustand state
│   │   ├── useScan.ts
│   │   └── useFileWatcher.ts
│   ├── lib/                # Utilities
│   │   └── utils.ts
│   ├── types.ts            # TypeScript types
│   └── App.tsx             # Main app component
├── src-tauri/              # Rust backend
│   ├── src/
│   │   ├── lib.rs          # Tauri entry point
│   │   ├── scanner.rs      # File discovery
│   │   ├── parser.rs       # Config parsing
│   │   ├── analyzer.rs     # Issue detection
│   │   ├── exporter.rs     # Multi-format export
│   │   ├── watcher.rs      # File watching
│   │   └── types.rs        # Rust types
│   └── Cargo.toml          # Rust dependencies
├── ROADMAP.md              # Future plans
├── CHANGELOG.md            # Version history
├── DISTRIBUTION.md         # Distribution guide
├── LICENSE                 # MIT License
└── package.json            # npm config
```

---

## 🗺️ Roadmap

See [ROADMAP.md](./ROADMAP.md) for detailed plans.

### MVP ✅ (Completed)
- Folder scanning with smart ignore patterns
- Multi-format parsing (.env, YAML, JSON, TOML)
- Issue detection (missing keys, duplicates, parse errors)
- Export to multiple formats
- Polished UI with dark/light themes

### Phase 2 ✅ (Completed)
- Performance optimization (async Rust backend)
- Interactive onboarding tour
- Keyboard shortcuts (⌘O, ⌘R, ⌘E)
- Copy to clipboard features
- Column visibility toggles
- Empty state illustrations
- Skeleton loading screens

### Phase 3 ✅ (Completed)
- **Live file watching** with auto-rescan
- Production build configuration
- Distribution ready (DMG, MSI, DEB, AppImage)

### Future 🔮
- Two-file diff view
- JSON Schema validation
- Auto-update mechanism
- Homebrew formula
- Plugin system
- CLI companion

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

### Development Workflow

```bash
# Install dependencies
npm install

# Run dev server (auto-reloads on changes)
npm run dev

# Build for production (creates installers)
npm run tauri build

# Lint code
npm run lint
```

See [DISTRIBUTION.md](./DISTRIBUTION.md) for detailed build and distribution instructions.

---

## 📝 License

MIT License - see [LICENSE](./LICENSE) for details

---

## 🙏 Acknowledgments

- **Jin the hedgehog**: This project is dedicated to your memory 🦔
- **Tauri**: For making native desktop apps with web tech possible
- **React team**: For React 19
- **shadcn/ui**: For beautiful component patterns
- **Vite team**: For blazing-fast builds

---

## 📧 Contact

- **Issues**: [GitHub Issues](https://github.com/yourusername/jin/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/jin/discussions)

---

## 💡 Why "Jin"?

Jin was a beloved hedgehog who brought joy and comfort. Like Jin, this tool aims to bring calm and order to the often-chaotic world of configuration management. Just as hedgehogs carefully organize their nests, Jin helps you organize your configs.

---

**Made with 🦔 and ❤️**
