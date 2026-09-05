import { WALLPAPERS } from '../data/wallpapers.js';
import { store } from '../services/store.js';
import { soundEffects } from '../services/audio.js';
import { downloadWallpaper } from '../services/downloader.js';
import { showToast } from '../components/Toast.js';
import { initCardTilt } from '../components/CardTilt.js';
import { initScene, openFullscreen3DModal } from '../services/scenes.js';

export class DetailView {
  constructor(container) {
    this.container = container;
    this.selectedResIndex = 0;
    this.is3DActive = true;
    this.currentSceneInstance = null;
  }

  getSceneType(wp) {
    const id = wp.id || '';
    if (id.includes('gojo') || id.includes('jinwoo') || id.includes('nebula') || id.includes('space')) {
      return 'nebula';
    }
    if (id.includes('tanjiro') || id.includes('ichigo') || id.includes('wave') || id.includes('sukuna')) {
      return 'waveform';
    }
    if (id.includes('lucy') || id.includes('eren') || id.includes('city') || id.includes('cyberpunk')) {
      return 'cityscape';
    }
    if (id.includes('chainsaw') || id.includes('megumi') || id.includes('zenitsu') || id.includes('shape')) {
      return 'geometric';
    }
    return 'moon';
  }

  render() {
    // Dispose previous scene if re-rendering
    if (this.currentSceneInstance) {
      this.currentSceneInstance.dispose();
      this.currentSceneInstance = null;
    }

    const wp = store.getCurrentWallpaper();
    const state = store.getState();
    const isLiked = state.favorites.includes(wp.id);
    const relatedWallpapers = WALLPAPERS.filter((w) => w.animeId === wp.animeId && w.id !== wp.id);
    const fallbackRelated = relatedWallpapers.length > 0 ? relatedWallpapers : WALLPAPERS.filter((w) => w.id !== wp.id).slice(0, 3);
    const sceneType = this.getSceneType(wp);

    this.container.innerHTML = `
      <div class="view-transition-enter detail-view-container">
        <div class="container">
          <!-- Back button -->
          <button class="detail-back-btn" id="btn-detail-back">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            <span>Back to Wallpapers</span>
          </button>

          <!-- Main Detail Layout -->
          <div class="detail-main-layout">
            <!-- Left: Interactive 3D Preview Stage -->
            <div style="display: flex; flex-direction: column; gap: 1.25rem;">
              <div class="detail-preview-stage" id="detail-stage" data-tilt style="position: relative; overflow: hidden; min-height: 440px;">
                <!-- 2D Artwork Image Layer -->
                <img src="${wp.image}" class="detail-preview-img" id="detail-main-img" alt="${wp.title}" style="display: ${this.is3DActive ? 'none' : 'block'};" />

                <!-- Live 3D WebGL Canvas Layer -->
                <div id="detail-3d-mount" style="position: absolute; inset: 0; width: 100%; height: 100%; display: ${this.is3DActive ? 'block' : 'none'}; z-index: 2;"></div>
                
                <!-- 3D Live Indicator Overlay -->
                <div style="position: absolute; top: 1.25rem; left: 1.25rem; z-index: 10; pointer-events: none;">
                  <span class="badge badge-live">★ 3D ${this.is3DActive ? 'WEBGL LIVE WORLD' : 'PARALLAX ART'}</span>
                </div>

                <!-- Stage Controls Overlay -->
                <div style="position: absolute; bottom: 1.25rem; right: 1.25rem; display: flex; gap: 0.6rem; z-index: 20;">
                  <button class="btn-icon ${this.is3DActive ? 'active' : ''}" id="btn-toggle-3d" title="Toggle 3D Live World / 2D Artwork" style="background: rgba(15,23,42,0.85); backdrop-filter: blur(8px);">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
                  </button>
                  <button class="btn-icon" id="btn-fullscreen-preview" title="Open Fullscreen 3D Viewer (Esc to exit)" style="background: rgba(15,23,42,0.85); backdrop-filter: blur(8px);">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
                  </button>
                </div>
              </div>

              <!-- Tags Pill Row -->
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; padding-top: 0.5rem;">
                ${wp.tags.map((t) => `<span class="badge badge-purple">#${t}</span>`).join('')}
              </div>
            </div>

            <!-- Right: Info & Download Panel -->
            <div class="detail-sidebar-info">
              <div>
                <div class="detail-anime-badge">${wp.anime.toUpperCase()} // ${wp.character.toUpperCase()}</div>
                <h1 class="detail-title">${wp.title}</h1>
                <div style="font-family: var(--font-mono); font-size: 0.95rem; color: var(--theme-accent); margin-top: 0.35rem;">${wp.japaneseTitle}</div>
              </div>

              <!-- Stats bar -->
              <div style="display: flex; align-items: center; gap: 1.5rem; padding: 0.85rem 1.25rem; border-radius: var(--radius-md); background: var(--bg-card); border: 1px solid var(--border-glass); font-size: 0.85rem;">
                <span style="color: #fbbf24; font-weight: 700;">★ ${wp.rating.toFixed(1)} (${wp.reviewCount.toLocaleString()} reviews)</span>
                <span style="color: var(--text-muted);">•</span>
                <span style="color: var(--text-secondary);">${wp.downloads.toLocaleString()} downloads</span>
                <span style="color: var(--text-muted);">•</span>
                <span style="color: var(--text-secondary);">${wp.views.toLocaleString()} views</span>
              </div>

              <p style="color: var(--text-secondary); line-height: 1.7; font-size: 0.95rem;">
                ${wp.description}
              </p>

              <!-- Resolution Selection Grid -->
              <div class="detail-resolution-picker">
                <span class="picker-label">Select Download Resolution</span>
                <div class="resolution-options-grid">
                  ${wp.resolutions.map((res, idx) => `
                    <button class="res-option-btn ${idx === this.selectedResIndex ? 'selected' : ''}" data-res-idx="${idx}">
                      <span class="res-option-name">${res.name}</span>
                      <span class="res-option-size">${res.width}x${res.height} • ${res.size}</span>
                    </button>
                  `).join('')}
                </div>
              </div>

              <!-- Download & Action Buttons -->
              <div class="download-action-box">
                <button class="btn btn-primary" id="btn-trigger-download" style="padding: 1rem 2rem; font-size: 1.05rem; width: 100%;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  <span>Download ${wp.resolutions[this.selectedResIndex].name}</span>
                </button>

                <!-- Download Progress Bar -->
                <div class="download-progress-bar" id="download-progress-wrap">
                  <div class="download-progress-fill" id="download-progress-bar"></div>
                </div>

                <!-- Secondary Actions Row -->
                <div style="display: flex; gap: 0.75rem; margin-top: 0.5rem;">
                  <button class="btn btn-secondary ${isLiked ? 'active' : ''}" id="btn-detail-like" style="flex: 1;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="${isLiked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
                    <span>${isLiked ? 'Liked in Favorites' : 'Add to Favorites'}</span>
                  </button>
                  <button class="btn btn-secondary" id="btn-detail-share" style="flex: 1;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                    <span>Share Link</span>
                  </button>
                </div>
              </div>

              <!-- Artist & Metadata Credits -->
              <div style="padding-top: 1rem; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-muted);">
                <span>Artist: <b style="color: var(--text-primary);">${wp.artist}</b></span>
                <span>Format: <b style="color: var(--text-primary);">PNG / HDR</b></span>
                <span>Aspect: <b style="color: var(--text-primary);">${wp.aspectRatio}</b></span>
              </div>
            </div>
          </div>

          <!-- Related Anime Wallpapers -->
          <section style="margin-top: 5rem; padding-top: 3rem; border-top: 1px solid var(--border-subtle);">
            <div class="section-header">
              <div class="section-title-wrapper">
                <span class="section-tag">// MORE FROM ${wp.anime.toUpperCase()}</span>
                <h3 class="section-title">Related 3D Wallpapers</h3>
              </div>
            </div>

            <div class="wallpaper-grid">
              ${fallbackRelated.map((rw) => this.renderRelatedCard(rw, state)).join('')}
            </div>
          </section>
        </div>
      </div>
    `;

    this.bindEvents(wp, sceneType);
    initCardTilt(this.container);

    if (this.is3DActive) {
      const mount = this.container.querySelector('#detail-3d-mount');
      if (mount) {
        this.currentSceneInstance = initScene(sceneType, mount, {
          showHint: true,
          hintText: '🖐 Drag to rotate 3D scene'
        });
      }
    }
  }

  renderRelatedCard(wp, state) {
    const isLiked = state.favorites.includes(wp.id);
    return `
      <div class="wallpaper-card-wrapper">
        <div class="wallpaper-card" data-id="${wp.id}">
          <div class="card-media-wrapper">
            <img src="${wp.thumbnail}" class="card-img" alt="${wp.title}" loading="lazy" />
            <div class="card-badges-top">
              <span class="badge badge-live">★ 3D LIVE</span>
              <button class="card-like-btn ${isLiked ? 'liked' : ''}" data-like-id="${wp.id}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="${isLiked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2.5"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
              </button>
            </div>
          </div>
          <div class="card-info">
            <span class="card-anime-tag">${wp.anime}</span>
            <h4 class="card-title">${wp.title}</h4>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents(wp, sceneType) {
    // Back button
    this.container.querySelector('#btn-detail-back')?.addEventListener('click', () => {
      soundEffects.playClick();
      store.navigate('browse');
    });

    // Toggle 3D Live / 2D Artwork
    this.container.querySelector('#btn-toggle-3d')?.addEventListener('click', () => {
      soundEffects.playClick();
      this.is3DActive = !this.is3DActive;
      this.render();
      showToast(this.is3DActive ? '3D WebGL World Activated' : '2D Artwork Mode Activated', 'info');
    });

    // Fullscreen 3D Interactive Modal
    this.container.querySelector('#btn-fullscreen-preview')?.addEventListener('click', () => {
      soundEffects.playClick();
      openFullscreen3DModal(sceneType, wp);
    });

    // Resolution options
    this.container.querySelectorAll('[data-res-idx]').forEach((btn) => {
      btn.addEventListener('click', () => {
        soundEffects.playClick();
        this.selectedResIndex = parseInt(btn.getAttribute('data-res-idx'), 10);
        this.render();
      });
    });

    // Download trigger with real progress
    const downloadBtn = this.container.querySelector('#btn-trigger-download');
    const progressWrap = this.container.querySelector('#download-progress-wrap');
    const progressBar = this.container.querySelector('#download-progress-bar');

    if (downloadBtn) {
      downloadBtn.addEventListener('click', async () => {
        const targetRes = wp.resolutions[this.selectedResIndex];
        downloadBtn.disabled = true;
        downloadBtn.innerHTML = `
          <svg class="spin-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
          <span>Rendering ${targetRes.name}...</span>
        `;
        if (progressWrap) progressWrap.style.display = 'block';

        await downloadWallpaper(wp, targetRes, (percent) => {
          if (progressBar) progressBar.style.width = `${percent}%`;
        });

        downloadBtn.disabled = false;
        downloadBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          <span>Download ${targetRes.name}</span>
        `;
        setTimeout(() => {
          if (progressWrap) progressWrap.style.display = 'none';
          if (progressBar) progressBar.style.width = '0%';
        }, 500);
      });
    }

    // Like button
    this.container.querySelector('#btn-detail-like')?.addEventListener('click', () => {
      soundEffects.playHeart();
      const isAdded = store.toggleFavorite(wp.id);
      showToast(isAdded ? `Saved "${wp.title}" to favorites` : 'Removed from favorites', 'info');
      this.render();
    });

    // Share button
    this.container.querySelector('#btn-detail-share')?.addEventListener('click', () => {
      soundEffects.playClick();
      navigator.clipboard?.writeText(window.location.href);
      showToast(`Link copied to clipboard! Share the dimension.`, 'success');
    });

    // Related cards click
    this.container.querySelectorAll('.wallpaper-card').forEach((card) => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('[data-like-id]')) return;
        const id = card.dataset.id;
        soundEffects.playClick();
        store.openWallpaperDetail(id);
      });
    });
  }
}
