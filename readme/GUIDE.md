# 🎮 MOON_VIEW User & Developer Guide

This guide covers usage workflows, development setup, styling customizations, and deployment tips for **MOON_VIEW**.

---

## 🛠️ Developer Setup & Commands

### Prerequisites
- Node.js version 18.0.0 or higher.
- npm version 9.0.0 or higher.

### Command Reference

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the local Vite development server on `http://localhost:5173/` |
| `npm run build` | Compiles and bundles production-ready assets into `dist/` |
| `npm run preview` | Locally tests and serves the compiled `dist/` production build |

---

## 🎨 Theme Customization

Accent color themes are declared in `src/styles/variables.css` and can be switched dynamically by setting the `data-theme-accent` attribute on the root `<html>` element:

```html
<html lang="en" data-theme-accent="cyan">
```

### Supported Accent Palettes:
- **`cyan`** (Default): Electric Neon Blue (`#00f5ff`)
- **`purple`**: Nebula Cosmic Violet (`#a855f7`)
- **`crimson`**: Blood Moon Scarlet (`#ff2d55`)
- **`gold`**: Solar Divinity Golden Amber (`#ffb800`)
- **`emerald`**: Cyber Glitch Mint (`#10b981`)

---

## 📥 Resolution Downloader API (`src/services/downloader.js`)

When downloading wallpapers, `DownloaderService` handles client-side dynamic Canvas upscaling, aspect ratio calculations, and automatic download triggers with filename conventions:

```javascript
// Example usage:
import { downloader } from './services/downloader.js';

downloader.downloadWallpaper(wallpaperObj, '8K Master', (progress) => {
  console.log(`Download progress: ${progress}%`);
});
```

---

## 🚀 Deployment

MOON_VIEW is configured with relative base paths (`base: './'`), allowing direct deployment on:
- **GitHub Pages**
- **Vercel**
- **Netlify**
- **Cloudflare Pages**

Simply run `npm run build` and upload the contents of the `dist/` directory.
