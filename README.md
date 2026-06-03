# My Snippet Manager: A Personal Snippet Manager for VS Code

[![Version](https://img.shields.io/badge/version-1.0.1-blue.svg)](https://github.com/webgrrrl/my-snippet-manager)
[![VS Code](https://img.shields.io/badge/VS%20Code-1.85.0+-blue.svg)](https://code.visualstudio.com/)

A powerful and simple snippet manager for VS Code that lets you save, organise, and reuse code snippets across any programming language. Save your frequently used code blocks and insert them with a single click!

## Features

✨ **Save any selection** - Select code in any file and save it as a snippet  
📝 **Quick insertion** - Click any snippet to insert it at your cursor position  
🗑️ **Easy management** - Delete snippets you no longer need  
💾 **Persistent storage** - Your snippets are saved and synced across VS Code sessions  
🎯 **Zero configuration** - Works out of the box with any file type  
⚡ **Status bar integration** - Quick access button to save snippets

![My Snippet Manager screenshot](media/demo-image-v1.0.1.png)

## How to Install

### Method 1: Install from VSIX File (Recommended)

If you simply want to install and use this extension, follow this method.

1. **Download the VSIX file**
   - Get the `my-snippet-manager-1.0.1.vsix` file from the [Releases](https://github.com/yourusername/my-snippet-manager/releases) page
   - Or build it yourself (see [Building from Source](#building-from-source))

2a. **Install using Command Line**...
   ```bash
   code --install-extension my-snippet-manager-1.0.1.vsix
   ```

2b. ... or **Install using VS Code UI**
   - Open VS Code
   - Go to Extensions view (`Ctrl+Shift+X` or `Cmd+Shift+X` on Mac)
   - Click on the `...` (More Actions) menu in the top-right
   - Select "Install from VSIX..."
   - Navigate to and select the `.vsix` file
   - Click "Install"

3. **Reload VS Code** (if prompted)

### Method 2: Install from VS Code Marketplace (Coming Soon)

```bash
# Once published to marketplace
code --install-extension my-snippet-manager
```

Or search for "Snippet Manager" in the Extensions view (`Ctrl+Shift+X`).

### Method 3: Manual Installation (Development)

```bash
# Clone the repository
git clone https://github.com/webgrrrl/my-snippet-manager.git
cd my-snippet-manager

# Install dependencies
npm install

# Build the extension
npm run compile

# Package into VSIX
npm install -g @vscode/vsce
vsce package

# Install the generated VSIX file
code --install-extension my-snippet-manager-1.0.1.vsix
```

## Quick Start Guide

### Saving Your First Snippet

1. **Open any code file** in VS Code
2. **Select the code** you want to save
3. **Click the "Save Snippet" button** in the bottom-right status bar
   - Or press `Ctrl+Shift+P` to open *Command Palette* and type "Save Selection as Snippet"
4. **Enter a name** for your snippet when prompted
5. **Done!** Your snippet is now saved

### Using Saved Snippets

1. **Open the Explorer sidebar** (first icon on the left)
2. **Scroll to "MY SNIPPETS"** section
3. **Click any snippet** to insert it at your cursor position
4. **Preview the snippet body** in the tooltip or description

### Managing Snippets

- **Delete a snippet**: Right-click on any snippet and select "Delete Snippet"
- **View snippet content**: Hover over any snippet to see a preview
- **Refresh list**: Snippets update automatically when added or deleted

## Commands

| Command | Description | Keyboard Shortcut |
|---------|-------------|-------------------|
| `Save Selection as Snippet` | Save selected code as a reusable snippet | None (use status bar) |
| `Delete Snippet` | Remove a saved snippet | Right-click on snippet |

## Configuration

No configuration required! The extension works immediately after installation.

### Optional Settings (Future Release)

```json
{
  "snippetManager.maxPreviewLength": 80,
  "snippetManager.confirmDelete": true,
  "snippetManager.sortOrder": "name" // or "date"
}
```

## Requirements

- **VS Code version**: 1.85.0 or higher
- **No external dependencies** - Works offline

## Known Issues

- None currently. Found a bug? [Report it here](https://github.com/webgrrrl/my-snippet-manager/issues)

## Building from Source

### Prerequisites

- [Node.js](https://nodejs.org/) (20.x or higher)
- [VS Code](https://code.visualstudio.com/) (1.85.0 or higher)

### Build Steps

```bash
# Clone the repository
git clone https://github.com/webgrrrl/my-snippet-manager.git
cd my-snippet-manager

# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch for changes (development)
npm run watch

# Package the extension
npm install -g @vscode/vsce
vsce package

# The .vsix file will be created in the current directory
```

### Development Testing

```bash
# Open in VS Code
code .

# Press F5 to launch Extension Development Host
# Make changes and test immediately
```

## Extension Structure

```
my-snippet-manager/
├── src/
│   └── extension.ts          # Main extension code
├── package.json               # Extension manifest
├── tsconfig.json              # TypeScript configuration
├── README.md                  # This file
└── .vscode/
    └── launch.json            # Debug configuration
```

## How It Works

1. **Saving**: Selected code + name → stored in VS Code's `globalState`
2. **Displaying**: TreeDataProvider reads `globalState` and creates a tree view
3. **Inserting**: Click triggers command with snippet body as argument
4. **Deleting**: Removes from `globalState` and refreshes the view

## Troubleshooting

### Extension doesn't appear in sidebar
- Make sure you see "MY SNIPPETS" in the Explorer sidebar
- If not, try reloading VS Code (`Ctrl+Shift+P` → "Developer: Reload Window")
- Check that the extension is enabled in Extensions view

### Can't save snippetsgit
- Ensure you have text selected in an editor
- Check that VS Code has write permissions to its storage
- Try restarting VS Code

### Snippets not inserting
- Make sure you have an active editor with focus
- Click on any snippet in the tree view
- Check the cursor position is not in a read-only area

### See errors in console
- Open Developer Tools (`Help` → `Toggle Developer Tools`)
- Look for red error messages
- [Open an issue](https://github.com/webgrrrl/my-snippet-manager/issues) with the error details

## Uninstalling

### Via Command Line
```bash
code --uninstall-extension my-snippet-manager
```

### Via VS Code UI
1. Go to Extensions view (`Ctrl+Shift+X`)
2. Find "Snippet Manager"
3. Click the gear icon
4. Select "Uninstall"

**Note**: Uninstalling will delete all your saved snippets.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Development Guidelines
- Use TypeScript for all code
- Follow VS Code [extension guidelines](https://code.visualstudio.com/api/references/extension-guidelines)
- Test your changes in the Extension Development Host
- Update documentation as needed

## Roadmap

- [ ] Search/filter snippets
- [ ] Snippet categories/folders
- [ ] Keyboard shortcuts for saving
- [ ] Export/import snippets to JSON
- [ ] Syntax highlighting preview
- [ ] Snippet templates with placeholders
- [ ] Cloud sync (optional)

## Support

- **Issues**: [GitHub Issues](https://github.com/webgrrrl/my-snippet-manager/issues)
- **Email**: me at lornatimbah.com or at webgrrrl.net
- **VS Code Marketplace**: Coming soon

## License

[MIT License](LICENSE) - feel free to use and modify!

## Credits

Created by [Lorna Timbah](https://github.com/webgrrrl)

Special thanks to Deepseek for helping me debug this extension.

---

**Tip**: Save your most-used code patterns, boilerplate templates, and complex logic snippets. This extension will save you hours of retyping!

⭐ **If you find this extension useful, please star the repository on GitHub!** ⭐
