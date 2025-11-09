# Distribution Guide

This guide explains how to build and distribute Jin for different platforms.

## Prerequisites

### macOS
- Xcode Command Line Tools installed
- Apple Developer account (for code signing and notarization)
- Valid Developer ID Application certificate

### Windows
- Visual Studio Build Tools
- Code signing certificate (optional but recommended)

### Linux
- Standard build tools (gcc, make, etc.)

## Building for Production

### 1. Build the Application

```bash
npm run tauri build
```

This will create optimized bundles in `src-tauri/target/release/bundle/`

### 2. Platform-Specific Outputs

**macOS**:
- `jin.app` - Application bundle
- `jin_X.X.X_aarch64.dmg` - DMG installer for Apple Silicon
- `jin_X.X.X_x64.dmg` - DMG installer for Intel Macs

**Windows**:
- `jin_X.X.X_x64.msi` - MSI installer
- `jin_X.X.X_x64-setup.exe` - NSIS installer

**Linux**:
- `jin_X.X.X_amd64.deb` - Debian package
- `jin_X.X.X_amd64.AppImage` - AppImage portable executable

## Code Signing

### macOS Code Signing

1. **Get your Developer ID**:
```bash
security find-identity -v -p codesigning
```

2. **Update `tauri.conf.json`**:
```json
{
  "bundle": {
    "macOS": {
      "signingIdentity": "Developer ID Application: Your Name (TEAM_ID)"
    }
  }
}
```

3. **Build with signing**:
```bash
npm run tauri build
```

4. **Notarize (required for macOS 10.15+)**:
```bash
# After building, notarize the .dmg
xcrun notarytool submit \
  src-tauri/target/release/bundle/dmg/jin_X.X.X_aarch64.dmg \
  --apple-id "your-apple-id@example.com" \
  --password "app-specific-password" \
  --team-id "TEAM_ID" \
  --wait

# Staple the notarization ticket
xcrun stapler staple src-tauri/target/release/bundle/dmg/jin_X.X.X_aarch64.dmg
```

### Windows Code Signing

1. **Obtain a code signing certificate** from a trusted CA (e.g., DigiCert, Sectigo)

2. **Update `tauri.conf.json`**:
```json
{
  "bundle": {
    "windows": {
      "certificateThumbprint": "YOUR_CERT_THUMBPRINT",
      "digestAlgorithm": "sha256",
      "timestampUrl": "http://timestamp.digicert.com"
    }
  }
}
```

3. **Build**:
```bash
npm run tauri build
```

## Distribution Channels

### Homebrew (macOS)

Create a Homebrew formula:

```ruby
class Jin < Formula
  desc "Config file management made easy"
  homepage "https://github.com/yourusername/jin"
  url "https://github.com/yourusername/jin/releases/download/v0.1.0/jin_0.1.0_aarch64.dmg"
  sha256 "..."
  version "0.1.0"

  def install
    prefix.install "jin.app"
  end
end
```

### GitHub Releases

1. **Create a new release** on GitHub
2. **Upload the installers**:
   - macOS: `.dmg` files
   - Windows: `.msi` and `.exe` files
   - Linux: `.deb` and `.AppImage` files
3. **Include release notes** from CHANGELOG.md

### App Stores

- **macOS App Store**: Requires additional configuration and Apple Developer Program membership
- **Windows Store**: Requires MSIX packaging and Microsoft developer account

## Auto-Update Setup

To enable auto-updates (future feature):

1. **Install Tauri updater plugin**:
```bash
npm install @tauri-apps/plugin-updater
```

2. **Configure updater** in `tauri.conf.json`:
```json
{
  "plugins": {
    "updater": {
      "active": true,
      "endpoints": [
        "https://releases.myapp.com/{{target}}/{{arch}}/{{current_version}}"
      ],
      "dialog": true,
      "pubkey": "YOUR_PUBLIC_KEY"
    }
  }
}
```

3. **Generate update keys**:
```bash
npm run tauri signer generate
```

## Testing Distribution Builds

Before releasing:

1. **Test on clean machines** without dev dependencies
2. **Verify code signature**:
   - macOS: `codesign -dv --verbose=4 Jin.app`
   - Windows: Right-click installer → Properties → Digital Signatures
3. **Check app permissions** and sandboxing
4. **Test installation** and uninstallation
5. **Verify auto-update** (if enabled)

## Troubleshooting

### macOS: "App is damaged and can't be opened"
- App wasn't properly signed or notarized
- Solution: Ensure signing identity is correct and app is notarized

### Windows: "Windows protected your PC"
- App isn't signed with a trusted certificate
- Solution: Sign with valid certificate or users can click "More info" → "Run anyway"

### Linux: Permission denied
- AppImage doesn't have execute permissions
- Solution: `chmod +x jin.AppImage`

## Resources

- [Tauri Bundle Configuration](https://tauri.app/v1/guides/distribution/)
- [Apple Code Signing Guide](https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution)
- [Windows Code Signing](https://docs.microsoft.com/en-us/windows/win32/seccrypto/cryptography-tools)
