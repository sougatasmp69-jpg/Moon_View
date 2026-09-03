import { ANIME_CATEGORIES, WALLPAPERS } from '../data/wallpapers.js';
import { store } from '../services/store.js';
import { initCardTilt } from '../components/CardTilt.js';
import { soundEffects } from '../services/audio.js';
import { downloadWallpaper } from '../services/downloader.js';
import { showToast } from '../components/Toast.js';
import { getAssetUrl } from '../utils/assets.js';

export class HomeView {
  constructor(container) {
    this.container = container;
  }

  render() {
    const state = store.getState();
    const trendingWallpapers = WALLPAPERS.filter((wp) => wp.isTrending).slice(0, 6);
    const bestViewWallpaper = WALLPAPERS.find((wp) => wp.isBestView) || WALLPAPERS[0];

    this.container.innerHTML = `
      <div class="view-transition-enter">
        <!-- Hero Banner Section -->
        <section class="hero-section">
          <div class="container hero-content">
            <div class="hero-pill-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <span>The Next-Gen 3D Anime Experience</span>
            </div>

            <h1 class="hero-title">
              STEP INTO ANOTHER <span class="text-gradient">DIMENSION</span>
            </h1>

            <p class="hero-description">
              Immerse your screens in ultra-high-definition 3D animated anime wallpapers. Featuring dynamic depth parallax, master 8K HDR renders, and direct multi-resolution instant downloads.
            </p>

            <div class="hero-cta-group">
              <button class="btn btn-primary" id="hero-btn-explore" style="padding: 0.95rem 2.2rem; font-size: 1.05rem;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
                Explore 3D Vault
              </button>
              <button class="btn btn-secondary" id="hero-btn-best-view" style="padding: 0.95rem 2rem; font-size: 1.05rem;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                View Best View VIP
              </button>
            </div>

            <!-- Stats Bar -->
            <div class="hero-stats-bar">
              <div class="hero-stat-item">
                <span class="hero-stat-value">8K HDR</span>
                <span class="hero-stat-label">Ultra Resolution</span>
              </div>
              <div class="hero-stat-divider"></div>
              <div class="hero-stat-item">
                <span class="hero-stat-value">60 FPS</span>
                <span class="hero-stat-label">3D Parallax Live</span>
              </div>
              <div class="hero-stat-divider"></div>
              <div class="hero-stat-item">
                <span class="hero-stat-value">500K+</span>
                <span class="hero-stat-label">Total Downloads</span>
              </div>
              <div class="hero-stat-divider"></div>
              <div class="hero-stat-item">
                <span class="hero-stat-value">100%</span>
                <span class="hero-stat-label">Free Creators</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Category Filter Bar -->
        <section class="category-filter-section">
          <div class="container">
            <div class="section-header">
              <div class="section-title-wrapper">
                <span class="section-tag">// UNIVERSE PORTAL</span>
                <h2 class="section-title">Explore by Anime Universe</h2>
              </div>
              <button class="btn btn-secondary" id="btn-view-all-gallery" style="font-size: 0.85rem; padding: 0.55rem 1.25rem;">
                View All Wallpapers (14+) →
              </button>
            </div>

            <div class="category-scroll-container">
              ${ANIME_CATEGORIES.map((cat) => `
                <button class="category-pill ${state.selectedAnime === cat.id ? 'active' : ''}" data-cat="${cat.id}">
                  <span>${cat.name}</span>
                  <span style="font-size: 0.75rem; opacity: 0.7; font-family: var(--font-mono);">(${cat.count})</span>
                </button>
              `).join('')}
            </div>
          </div>
        </section>

        <!-- Featured & Trending Wallpapers Grid -->
        <section style="padding: 3rem 0 5rem;">
          <div class="container">
            <div class="section-header">
              <div class="section-title-wrapper">
                <span class="section-tag">// POPULAR IN THE GALAXY</span>
                <h2 class="section-title">Featured 3D Animated Wallpapers</h2>
              </div>
            </div>

            <div class="wallpaper-grid">
              ${trendingWallpapers.map((wp) => this.renderWallpaperCard(wp, state)).join('')}
            </div>
          </div>
        </section>

        <!-- Best View VIP Section -->
        <section class="best-view-section" id="best-view-showcase">
          <div class="container">
            <div class="section-header">
              <div class="section-title-wrapper">
                <span class="section-tag">// CURATOR'S PICK OF THE MONTH</span>
                <h2 class="section-title">Best View VIP Showcase</h2>
              </div>
            </div>

            <div class="best-view-card">
              <div class="best-view-preview-col" data-id="${bestViewWallpaper.id}">
                <div class="best-view-floating-badge">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  <span>BEST VIEW ★★★★★</span>
                </div>
                <img src="${bestViewWallpaper.image}" class="best-view-img" alt="${bestViewWallpaper.title}" />
              </div>

              <div class="best-view-info-col">
                <div>
                  <span class="badge badge-purple" style="margin-bottom: 0.75rem;">${bestViewWallpaper.anime}</span>
                  <h3 class="best-view-title">${bestViewWallpaper.title}</h3>
                  <div style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--theme-accent); margin-top: 0.25rem;">${bestViewWallpaper.japaneseTitle}</div>
                </div>

                <p class="best-view-desc">${bestViewWallpaper.description}</p>

                <div class="best-view-spec-grid">
                  <div>
                    <div class="spec-cell-label">Resolution</div>
                    <div class="spec-cell-val" style="color: var(--neon-cyan);">8K Master</div>
                  </div>
                  <div>
                    <div class="spec-cell-label">Total Downloads</div>
                    <div class="spec-cell-val">${bestViewWallpaper.downloads.toLocaleString()}</div>
                  </div>
                  <div>
                    <div class="spec-cell-label">Community Rating</div>
                    <div class="spec-cell-val" style="color: #fbbf24;">★ 5.0 / 5.0</div>
                  </div>
                </div>

                <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
                  <button class="btn btn-primary" id="btn-best-view-open" data-id="${bestViewWallpaper.id}" style="padding: 0.85rem 1.75rem;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    Interactive 3D Preview
                  </button>
                  <button class="btn btn-secondary" id="btn-best-view-quick-dl" data-id="${bestViewWallpaper.id}" style="padding: 0.85rem 1.5rem;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Download 8K Master
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 3D Holographic Parallax Depth Showcase -->
        <section class="depth-showcase-section">
          <div class="container">
            <div class="depth-stage-box">
              <div class="depth-viewport" id="interactive-depth-stage">
                <img src="${getAssetUrl('/wallpapers/lucy_cyberpunk_moon.jpg')}" class="depth-layer" id="depth-bg" alt="Depth Preview" />
                <div style="position: absolute; inset: 0; background: radial-gradient(circle at center, transparent 30%, rgba(5,6,15,0.7) 100%); pointer-events: none;"></div>
                <div style="position: absolute; bottom: 1.25rem; left: 1.25rem; background: rgba(0,0,0,0.75); backdrop-filter: blur(8px); padding: 0.4rem 0.85rem; border-radius: var(--radius-sm); border: 1px solid var(--border-neon); font-family: var(--font-mono); font-size: 0.75rem; color: #38bdf8;">
                  ✦ Move Cursor to Test 3D Parallax Gyro
                </div>
              </div>

              <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                <span class="section-tag">// DEPTH-LOCK ENGINE</span>
                <h3 style="font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 900;">Multi-Layered 3D Motion Technology</h3>
                <p style="color: var(--text-secondary); line-height: 1.7;">
                  MOON_VIEW wallpapers are built with real-time multi-plane depth buffers. Foreground anime characters, mystical energy auras, and cosmic planetary backdrops react seamlessly to your cursor and device orientation.
                </p>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                  <span class="badge badge-cyan">✓ Zero CPU Throttle</span>
                  <span class="badge badge-purple">✓ 60 FPS Gyroscope</span>
                  <span class="badge badge-gold">✓ Multi-Device Sync</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    `;

    this.bindEvents();
    initCardTilt(this.container);
    this.initDepthStage();
  }

  renderWallpaperCard(wp, state) {
    const isLiked = state.favorites.includes(wp.id);
    return `
      <div class="wallpaper-card-wrapper">
        <div class="wallpaper-card" data-id="${wp.id}">
          <div class="card-media-wrapper">
            <img src="${wp.thumbnail}" class="card-img" alt="${wp.title}" loading="lazy" />
            
            <div class="card-badges-top">
              <span class="badge badge-live">★ 3D LIVE</span>
              <button class="card-like-btn ${isLiked ? 'liked' : ''}" data-like-id="${wp.id}" title="${isLiked ? 'Unlike' : 'Like'}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="${isLiked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2.5"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
              </button>
            </div>

            <div class="card-hover-drawer">
              <button class="btn btn-primary btn-preview-card" data-id="${wp.id}" style="padding: 0.55rem 1.15rem; font-size: 0.85rem;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                Preview 3D
              </button>
              <button class="btn btn-secondary btn-quick-dl-card" data-id="${wp.id}" style="padding: 0.55rem 1rem; font-size: 0.85rem;" title="Quick Download">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              </button>
            </div>
          </div>

          <div class="card-info">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span class="card-anime-tag">${wp.anime}</span>
              <span class="card-resolution-pill">${wp.resolutionTag}</span>
            </div>
            <h4 class="card-title" title="${wp.title}">${wp.title}</h4>
            <div class="card-meta-bar">
              <span class="card-meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                ${(wp.downloads / 1000).toFixed(1)}k
              </span>
              <span class="card-meta-item" style="color: #fbbf24;">
                ★ ${wp.rating.toFixed(1)}
              </span>
              <span class="card-meta-item">
                ${wp.character}
              </span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    // Hero buttons
    this.container.querySelector('#hero-btn-explore')?.addEventListener('click', () => {
      soundEffects.playClick();
      store.navigate('browse');
    });

    this.container.querySelector('#hero-btn-best-view')?.addEventListener('click', () => {
      soundEffects.playClick();
      document.getElementById('best-view-showcase')?.scrollIntoView({ behavior: 'smooth' });
    });

    this.container.querySelector('#btn-view-all-gallery')?.addEventListener('click', () => {
      soundEffects.playClick();
      store.setFilters({ selectedAnime: 'all' });
      store.navigate('browse');
    });

    // Category pills
    this.container.querySelectorAll('[data-cat]').forEach((btn) => {
      btn.addEventListener('click', () => {
        soundEffects.playClick();
        const cat = btn.getAttribute('data-cat');
        store.setFilters({ selectedAnime: cat });
        store.navigate('browse');
      });
    });

    // Card click -> open detail
    this.container.querySelectorAll('.wallpaper-card').forEach((card) => {
      card.addEventListener('click', (e) => {
        // Prevent if clicking like or direct download
        if (e.target.closest('[data-like-id]') || e.target.closest('.btn-quick-dl-card')) return;
        const id = card.dataset.id;
        soundEffects.playClick();
        store.openWallpaperDetail(id);
      });
    });

    // Like button
    this.container.querySelectorAll('[data-like-id]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        soundEffects.playHeart();
        const id = btn.getAttribute('data-like-id');
        const isAdded = store.toggleFavorite(id);
        btn.classList.toggle('liked', isAdded);
        showToast(isAdded ? 'Added to your favorites' : 'Removed from favorites', 'info');
      });
    });

    // Quick download
    this.container.querySelectorAll('.btn-quick-dl-card').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const wp = WALLPAPERS.find((w) => w.id === id);
        if (wp) {
          downloadWallpaper(wp, wp.resolutions[0]);
        }
      });
    });

    // Best view buttons
    this.container.querySelector('#btn-best-view-open')?.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      soundEffects.playClick();
      store.openWallpaperDetail(id);
    });

    this.container.querySelector('#btn-best-view-quick-dl')?.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      const wp = WALLPAPERS.find((w) => w.id === id);
      if (wp) downloadWallpaper(wp, wp.resolutions[0]);
    });
  }

  initDepthStage() {
    const stage = this.container.querySelector('#interactive-depth-stage');
    const bg = this.container.querySelector('#depth-bg');
    if (!stage || !bg) return;

    stage.addEventListener('mousemove', (e) => {
      const rect = stage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      bg.style.transform = `scale(1.15) translate(${x * -25}px, ${y * -25}px)`;
    });

    stage.addEventListener('mouseleave', () => {
      bg.style.transform = 'scale(1) translate(0px, 0px)';
    });
  }
}
