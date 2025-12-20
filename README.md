# Diablo JS Remastered

An isometric hack-and-slash RPG engine built with modern JavaScript and HTML5 Canvas.

## 🚀 Recent Updates

- **Modular Architecture**: Codebase split into `core`, `entities`, `render`, `world`, and `ui`.
- **UI Overlay**: HTML/CSS based HUD with Health/Mana orbs and Skill bar.
- **Port**: Configured to run on Port **3012** (Registered).

## 🛠️ Development

1. **Install Dependencies**: `npm install`
2. **Start Server**: `npm run dev`
3. **Visit**: `http://localhost:3012`

## 📁 Structure

- `src/core`: Game loop (`Game.js`) and Input (`Input.js`).
- `src/entities`: Game objects (`Hero.js`, `Mob.js`, `Items.js`).
- `src/render`: Canvas rendering (`Renderer.js`).
- `src/ui`: DOM Overlay Manager (`UIManager.js`).
- `src/world`: Level data and map logic (`World.js`).

## ⚠️ Known Issues

- Rendering currently displays a black screen (Camera translation/Asset path calibration needed).
- UI Orbs might be misaligned on some viewports.

## 📜 Credits

Refactored from the original [diablo-js](https://github.com/mitallast/diablo-js).
