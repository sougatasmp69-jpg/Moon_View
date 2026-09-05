# 🏗️ MOON_VIEW System Architecture

This document details the architectural design, reactive state management, rendering pipeline, and component structure of **MOON_VIEW**.

---

## 📐 High-Level Architecture

```
+-------------------------------------------------------------+
|                     index.html (Entry)                      |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|                    src/main.js (App Boot)                   |
|  - Inits CosmicBackground Canvas Engine                     |
|  - Inits Global Navigation & Footer                         |
|  - Inits QuickSearch Modal                                  |
|  - Subscribes to Store state changes                        |
|  - Handles URL hash routing                                 |
+-------------------------------------------------------------+
        |                     |                     |
        v                     v                     v
+---------------+     +---------------+     +---------------+
|  UI Views     |     | Store Service |     | Canvas Engine |
| - HomeView    |     | - State       |     | - Starfield   |
| - BrowseView  | <-> | - Subscribers |     | - Cosmic Moon |
| - DetailView  |     | - Actions     |     | - Nebula Fog  |
| - AuthView    |     | - Storage     |     | - Dust / Glow |
| - Dashboard   |     +---------------+     +---------------+
+---------------+             |
                              v
                      +---------------+
                      | Audio / DL    |
                      | - Sound Synths|
                      | - Res Scals   |
                      +---------------+
```

---

## 🔄 Reactive State Store (`src/services/store.js`)

MOON_VIEW utilizes a lightweight pub/sub reactive store that persists critical states to `localStorage`:

### Key State Properties
- `currentView`: Active view name (`'home'`, `'browse'`, `'detail'`, `'auth'`, `'dashboard'`).
- `detailWallpaperId`: Active wallpaper ID when viewing details.
- `favorites`: Array of favorited wallpaper IDs.
- `downloadHistory`: Array of downloaded items with timestamp and resolution.
- `user`: User profile object (name, handle, avatar, bio, downloads count).
- `activeFilter`: Current universe filter for browse view.
- `searchQuery`: Search string for filtering catalog.
- `soundEnabled`: Boolean toggle for UI audio effects.
- `accentTheme`: Current color theme (`'cyan'`, `'purple'`, `'crimson'`, `'gold'`, `'emerald'`).

---

## 🌌 3D Canvas Space Engine (`src/components/CosmicBackground.js`)

The background renders a 60 FPS procedural particle system with layered cosmic depth:
1. **Dynamic Stars Layer**: 250+ twinkling stars with variable sizes, opacity pulses, and slow drift.
2. **Glowing Celestial Moon**: Large glowing circular gradient with crater textures and an atmospheric halo.
3. **Shooting Star Generator**: Periodic streak particles with decaying tails.
4. **Interactive Mouse Parallax**: Fluid mouse velocity tracking that tilts the camera perspective in response to pointer movements.

---

## 🎴 3D Card Parallax Engine (`src/components/CardTilt.js`)

Each wallpaper card features real-time 3D rotation based on mouse coordinates relative to card center:
- Calculates pitch ($R_x$) and yaw ($R_y$).
- Applies `transform: perspective(1000px) rotateX(...) rotateY(...) scale3d(1.03, 1.03, 1.03)`.
- Updates dynamic specular lighting glare overlay with CSS radial gradient coordinates.
