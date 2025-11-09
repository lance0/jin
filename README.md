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
- Click-to-reveal individual secret values
- Warns about sensitive keys in exported files

### 🚨 **Issue Detection**
- **Missing Keys**: Shows which keys are missing from each `.env` file
- **Duplicates**: Identifies keys that appear in multiple files
- **Parse Errors**: Catches and reports malformed config files

### 📊 **Visual Matrix**
- See all keys and their presence across files at a glance
- Search and filter keys
- View values with type inference (string, number, boolean, null)
- Responsive table with hover states

### 📤 **Export Clean Configs**
- One-click export to `.env.example`
- Includes type hints as comments
- Alphabetically sorted keys
- Blank values ready for your team to fill in

### 🎨 **Polished UI**
- Dark and light themes
- Smooth animations and transitions
- Toast notifications
- Keyboard-friendly
- Responsive design

---

## 🚀 Quick Start

### Prerequisites
- **macOS**: 11+ (Big Sur or later)
- **Windows**: 10+ (coming soon)
- **Linux**: Ubuntu 20.04+ (coming soon)

### Installation

#### Option 1: Download Pre-built Binary (Coming Soon)
```bash
# macOS (Homebrew)
brew install jin-config

# Or download from Releases page
# https://github.com/yourusername/jin/releases
```

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

# Or build for production
npm run build
```

---

## 📖 Usage

### 1. Choose a Project Folder
- Click **"Choose a project folder"** on the welcome screen
- Or drag and drop a folder (coming soon)

### 2. Review Issues
- Check the **Issues Panel** on the left for:
  - Missing keys in `.env` files
  - Duplicate keys across files
  - Parse errors

### 3. Inspect the Matrix
- Use the **Config Matrix** to see which keys exist in which files
- Search for specific keys
- Click to reveal masked secret values

### 4. Export `.env.example`
- Click **"Export .env.example"** in the footer
- File is saved to your project root
- Share with your team!

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
- **Rust**: Native backend
- **walkdir**: Directory traversal
- **serde**: Serialization
- **YAML/JSON/TOML parsers**

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
│   │   └── Footer.tsx
│   ├── store/              # Zustand state
│   │   └── useScan.ts
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
│   │   ├── exporter.rs     # .env.example generation
│   │   └── types.rs        # Rust types
│   └── Cargo.toml          # Rust dependencies
├── ROADMAP.md              # Future plans
├── CHANGELOG.md            # Version history
└── package.json            # npm config
```

---

## 🗺️ Roadmap

See [ROADMAP.md](./ROADMAP.md) for detailed plans.

### MVP ✅ (Completed)
- Folder scanning
- Multi-format parsing
- Issue detection
- Export functionality
- Basic UI

### Phase 2 🚧 (In Progress)
- Drag-and-drop
- Custom ignore patterns
- Keyboard shortcuts
- Improved mobile responsiveness

### Phase 3 🔮 (Future)
- Live file watching
- Two-file diff view
- JSON Schema validation
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

# Build for production
npm run build

# Lint code
npm run lint
```

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
