import { ANIME_CATEGORIES, WALLPAPERS } from '../data/wallpapers.js';
import { store } from '../services/store.js';
import { initCardTilt } from '../components/CardTilt.js';
import { soundEffects } from '../services/audio.js';
import { downloadWallpaper } from '../services/downloader.js';
import { showToast } from '../components/Toast.js';

export class BrowseView {
  constructor(container) {
    this.container = container;
  }

  render() {
    const state = store.getState();
    const wallpapers = store.getFilteredWallpapers();

    this.container.innerHTML = `
      <div class="view-transition-enter" style="padding: 2.5rem 0 6rem;">
        <div class="container">
          <!-- Gallery Header & Title -->
          <div style="margin-bottom: 2.5rem;">
            <span class="section-tag">// 3D ANIMATED VAULT</span>
            <h1 style="font-size: clamp(2.2rem, 4vw, 3.2rem); font-weight: 900; margin-top: 0.35rem;">
              Browse Anime Wallpapers
            </h1>
            <p style="color: var(--text-secondary); max-width: 600px; margin-top: 0.5rem;">
              Explore our full collection of interactive 3D anime wallpapers. Filter by universe, resolution, or orientation.
            </p>
          </div>

          <!-- Search & Filter Controls -->
          <div class="gallery-header-bar">
            <!-- Search Bar -->
            <div class="gallery-search-bar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--theme-accent)" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" id="gallery-search-input" class="gallery-search-input" placeholder="Search by anime, character, technique (e.g. Gojo, Tanjiro, Nika)..." value="${state.searchQuery}" />
              ${state.searchQuery ? `
                <button id="btn-clear-search" style="color: var(--text-muted); cursor: pointer; padding: 0.25rem;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              ` : ''}
            </div>

            <!-- Filter Dropdowns Row -->
            <div class="gallery-filter-controls">
              <div class="filter-group">
                <!-- Anime Universe Select -->
                <select class="custom-select" id="filter-anime-select">
                  <option value="all" ${state.selectedAnime === 'all' ? 'selected' : ''}>All Universes</option>
                  ${ANIME_CATEGORIES.filter((c) => c.id !== 'all').map((c) => `
                    <option value="${c.id}" ${state.selectedAnime === c.id ? 'selected' : ''}>${c.name}</option>
                  `).join('')}
                </select>

                <!-- Resolution Select -->
                <select class="custom-select" id="filter-res-select">
                  <option value="all" ${state.selectedResolution === 'all' ? 'selected' : ''}>All Resolutions</option>
                  <option value="8k" ${state.selectedResolution === '8k' ? 'selected' : ''}>8K Ultra Master</option>
                  <option value="4k" ${state.selectedResolution === '4k' ? 'selected' : ''}>4K UHD & Above</option>
                </select>

                <!-- Orientation Select -->
                <select class="custom-select" id="filter-orient-select">
                  <option value="all" ${state.selectedOrientation === 'all' ? 'selected' : ''}>All Orientations</option>
                  <option value="desktop" ${state.selectedOrientation === 'desktop' ? 'selected' : ''}>Desktop (16:9)</option>
                </select>

                <!-- 3D Live Toggle Pill -->
                <button class="category-pill ${state.filter3DOnly ? 'active' : ''}" id="filter-3d-toggle">
                  <span>★ 3D Live Only</span>
                </button>
              </div>

              <!-- Sort By Dropdown -->
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--font-mono);">SORT BY:</span>
                <select class="custom-select" id="filter-sort-select">
                  <option value="trending" ${state.selectedSort === 'trending' ? 'selected' : ''}>Trending / Popular</option>
                  <option value="downloads" ${state.selectedSort === 'downloads' ? 'selected' : ''}>Most Downloaded</option>
                  <option value="rating" ${state.selectedSort === 'rating' ? 'selected' : ''}>Highest Rated</option>
                  <option value="newest" ${state.selectedSort === 'newest' ? 'selected' : ''}>Newest Added</option>
                </select>
              </div>
            </div>

            <!-- Results Count & Active Tags -->
            <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border-subtle); padding-top: 1rem; font-size: 0.85rem; color: var(--text-secondary);">
              <div>
                Showing <b style="color: #ffffff;">${wallpapers.length}</b> wallpapers in vault
              </div>
              ${(state.selectedAnime !== 'all' || state.selectedResolution !== 'all' || state.searchQuery || state.filter3DOnly) ? `
                <button class="btn-secondary" id="btn-reset-filters" style="font-size: 0.75rem; padding: 0.35rem 0.85rem; border-radius: var(--radius-full); cursor: pointer;">
                  Reset All Filters ✕
                </button>
              ` : ''}
            </div>
          </div>

          <!-- Wallpapers Grid -->
          ${wallpapers.length > 0 ? `
            <div class="wallpaper-grid">
              ${wallpapers.map((wp) => this.renderWallpaperCard(wp, state)).join('')}
            </div>
          ` : `
            <div style="text-align: center; padding: 6rem 2rem; background: var(--bg-card); border-radius: var(--radius-xl); border: 1px dashed var(--border-glass);">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5" style="margin: 0 auto 1.5rem;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <h3 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem;">No Wallpapers Found</h3>
              <p style="color: var(--text-secondary); max-width: 420px; margin: 0 auto 1.5rem;">
                No anime wallpapers matched your current search filters. Try resetting the filters or searching for another character.
              </p>
              <button class="btn btn-primary" id="btn-empty-reset">
                Reset All Filters
              </button>
            </div>
          `}
        </div>
      </div>
    `;

    this.bindEvents();
    initCardTilt(this.container);
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
    // Search input
    const searchInput = this.container.querySelector('#gallery-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        store.setFilters({ searchQuery: e.target.value });
      });
    }

    this.container.querySelector('#btn-clear-search')?.addEventListener('click', () => {
      store.setFilters({ searchQuery: '' });
    });

    // Dropdown filters
    this.container.querySelector('#filter-anime-select')?.addEventListener('change', (e) => {
      soundEffects.playClick();
      store.setFilters({ selectedAnime: e.target.value });
    });

    this.container.querySelector('#filter-res-select')?.addEventListener('change', (e) => {
      soundEffects.playClick();
      store.setFilters({ selectedResolution: e.target.value });
    });

    this.container.querySelector('#filter-orient-select')?.addEventListener('change', (e) => {
      soundEffects.playClick();
      store.setFilters({ selectedOrientation: e.target.value });
    });

    this.container.querySelector('#filter-sort-select')?.addEventListener('change', (e) => {
      soundEffects.playClick();
      store.setFilters({ selectedSort: e.target.value });
    });

    this.container.querySelector('#filter-3d-toggle')?.addEventListener('click', () => {
      soundEffects.playClick();
      store.setFilters({ filter3DOnly: !store.getState().filter3DOnly });
    });

    const resetFilters = () => {
      soundEffects.playClick();
      store.setFilters({
        selectedAnime: 'all',
        selectedResolution: 'all',
        selectedOrientation: 'all',
        filter3DOnly: false,
        searchQuery: ''
      });
    };

    this.container.querySelector('#btn-reset-filters')?.addEventListener('click', resetFilters);
    this.container.querySelector('#btn-empty-reset')?.addEventListener('click', resetFilters);

    // Card click
    this.container.querySelectorAll('.wallpaper-card').forEach((card) => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('[data-like-id]') || e.target.closest('.btn-quick-dl-card')) return;
        const id = card.dataset.id;
        soundEffects.playClick();
        store.openWallpaperDetail(id);
      });
    });

    // Preview button click
    this.container.querySelectorAll('.btn-preview-card').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
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
        showToast(isAdded ? 'Added to favorites' : 'Removed from favorites', 'info');
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
  }
}
