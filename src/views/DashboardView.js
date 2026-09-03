import { store } from '../services/store.js';
import { WALLPAPERS } from '../data/wallpapers.js';
import { soundEffects } from '../services/audio.js';
import { downloadWallpaper } from '../services/downloader.js';
import { showToast } from '../components/Toast.js';
import { initCardTilt } from '../components/CardTilt.js';

export class DashboardView {
  constructor(container) {
    this.container = container;
    this.activeTab = 'downloads'; // 'downloads' | 'favorites' | 'settings'
  }

  render() {
    const state = store.getState();
    const user = state.user;

    if (!user) {
      this.container.innerHTML = `
        <div class="view-transition-enter container" style="padding: 6rem 1.5rem; text-align: center;">
          <h2 style="font-size: 2rem; font-weight: 800; margin-bottom: 1rem;">Sign in Required</h2>
          <p style="color: var(--text-secondary); margin-bottom: 2rem;">Please log in to view your user dashboard, downloads history, and saved favorites.</p>
          <button class="btn btn-primary" id="btn-dash-login">Sign In / Register</button>
        </div>
      `;
      this.container.querySelector('#btn-dash-login')?.addEventListener('click', () => {
        store.navigate('auth');
      });
      return;
    }

    const favoriteWallpapers = WALLPAPERS.filter((w) => state.favorites.includes(w.id));
    const history = state.downloadHistory;

    this.container.innerHTML = `
      <div class="view-transition-enter dashboard-container">
        <div class="container">
          <!-- Profile Hero Card -->
          <div class="profile-hero-card">
            <div class="profile-user-left">
              <div class="profile-avatar-wrapper">
                <img src="${user.avatar}" class="profile-avatar-large" alt="avatar" />
              </div>
              <div>
                <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
                  <h1 style="font-size: 1.8rem; font-weight: 900;">${user.username}</h1>
                  <span class="badge badge-purple">${user.rank}</span>
                </div>
                <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.25rem;">
                  ${user.email} • Member since ${user.joinedDate}
                </div>
              </div>
            </div>

            <!-- Download Quota Stats -->
            <div style="display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap;">
              <div style="text-align: right;">
                <div style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono); text-transform: uppercase;">
                  Downloads Used
                </div>
                <div style="font-size: 1.5rem; font-weight: 800; color: #ffffff;">
                  ${user.downloadsUsed} <span style="font-size: 0.9rem; color: var(--text-muted);">/ ∞</span>
                </div>
              </div>

              <button class="btn btn-secondary" id="btn-dash-logout" style="font-size: 0.85rem; padding: 0.6rem 1.25rem;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                Sign Out
              </button>
            </div>
          </div>

          <!-- Dashboard Tabs -->
          <div class="dashboard-tab-bar">
            <button class="dash-tab-btn ${this.activeTab === 'downloads' ? 'active' : ''}" data-dash-tab="downloads">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              My Downloads (${history.length})
            </button>
            <button class="dash-tab-btn ${this.activeTab === 'favorites' ? 'active' : ''}" data-dash-tab="favorites">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
              My Favorites (${favoriteWallpapers.length})
            </button>
            <button class="dash-tab-btn ${this.activeTab === 'settings' ? 'active' : ''}" data-dash-tab="settings">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              Account Settings
            </button>
          </div>

          <!-- Tab Contents -->
          ${this.activeTab === 'downloads' ? this.renderDownloadsTab(history) : ''}
          ${this.activeTab === 'favorites' ? this.renderFavoritesTab(favoriteWallpapers) : ''}
          ${this.activeTab === 'settings' ? this.renderSettingsTab(user, state) : ''}
        </div>
      </div>
    `;

    this.bindEvents();
    if (this.activeTab === 'favorites') {
      initCardTilt(this.container);
    }
  }

  renderDownloadsTab(history) {
    if (history.length === 0) {
      return `
        <div style="text-align: center; padding: 5rem 2rem; background: var(--bg-card); border-radius: var(--radius-xl); border: 1px dashed var(--border-glass);">
          <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">You haven't downloaded any 3D anime wallpapers yet.</p>
          <button class="btn btn-primary" data-nav="browse">Explore Vault</button>
        </div>
      `;
    }

    return `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        ${history.map((item) => `
          <div class="glass-panel" style="display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.5rem; gap: 1.5rem; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 1.25rem;">
              <img src="${item.image}" style="width: 80px; height: 50px; object-fit: cover; border-radius: 8px; border: 1px solid var(--border-glass);" />
              <div>
                <h4 style="font-size: 1.05rem; font-weight: 800; color: #ffffff;">${item.wallpaperTitle}</h4>
                <div style="font-size: 0.8rem; color: var(--theme-accent); font-family: var(--font-mono); margin-top: 0.2rem;">
                  ${item.anime} • <span style="color: var(--text-muted);">${item.timestamp}</span>
                </div>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 1rem;">
              <span class="badge badge-cyan">${item.resolution}</span>
              <button class="btn btn-secondary btn-redownload" data-id="${item.wallpaperId}" style="padding: 0.5rem 1rem; font-size: 0.85rem;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Re-Download
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderFavoritesTab(favoriteWallpapers) {
    if (favoriteWallpapers.length === 0) {
      return `
        <div style="text-align: center; padding: 5rem 2rem; background: var(--bg-card); border-radius: var(--radius-xl); border: 1px dashed var(--border-glass);">
          <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Your favorites list is empty. Click the heart icon on any wallpaper card to save it here!</p>
          <button class="btn btn-primary" data-nav="browse">Discover Wallpapers</button>
        </div>
      `;
    }

    return `
      <div class="wallpaper-grid">
        ${favoriteWallpapers.map((wp) => `
          <div class="wallpaper-card-wrapper">
            <div class="wallpaper-card" data-id="${wp.id}">
              <div class="card-media-wrapper">
                <img src="${wp.thumbnail}" class="card-img" alt="${wp.title}" />
                <div class="card-badges-top">
                  <span class="badge badge-live">★ 3D LIVE</span>
                  <button class="card-like-btn liked" data-like-id="${wp.id}" title="Remove from favorites">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2.5"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
                  </button>
                </div>
              </div>
              <div class="card-info">
                <span class="card-anime-tag">${wp.anime}</span>
                <h4 class="card-title">${wp.title}</h4>
                <div class="card-meta-bar">
                  <span>${wp.resolutionTag}</span>
                  <span style="color: #fbbf24;">★ ${wp.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderSettingsTab(user, state) {
    const avatars = [
      '/avatars/avatar_cosmic_hero.svg',
      '/avatars/avatar_shadow_ninja.svg',
      '/avatars/avatar_cyber_glitch.svg'
    ];

    const themes = [
      { id: 'cyan', name: 'Moon Cyan', color: '#06b6d4' },
      { id: 'purple', name: 'Cosmic Purple', color: '#a855f7' },
      { id: 'pink', name: 'Cyber Pink', color: '#ec4899' },
      { id: 'gold', name: 'Solar Gold', color: '#f59e0b' }
    ];

    return `
      <div class="glass-panel" style="padding: 2.5rem; max-width: 680px; margin: 0 auto;">
        <h3 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 2rem;">Collector Preferences</h3>

        <!-- Avatar Picker -->
        <div style="margin-bottom: 2rem;">
          <label class="form-label" style="margin-bottom: 0.75rem; display: block;">Select Cosmic Avatar</label>
          <div style="display: flex; gap: 1rem;">
            ${avatars.map((av) => `
              <div class="avatar-option ${user.avatar === av ? 'selected' : ''}" data-avatar-url="${av}" style="cursor: pointer; padding: 4px; border-radius: 50%; border: 2px solid ${user.avatar === av ? 'var(--theme-accent)' : 'transparent'};">
                <img src="${av}" style="width: 60px; height: 60px; border-radius: 50%;" />
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Theme Accent Picker -->
        <div style="margin-bottom: 2rem;">
          <label class="form-label" style="margin-bottom: 0.75rem; display: block;">Platform Neon Theme Accent</label>
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            ${themes.map((t) => `
              <button class="btn btn-secondary ${state.themeAccent === t.id ? 'active' : ''}" data-set-theme="${t.id}" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem;">
                <span style="width: 12px; height: 12px; border-radius: 50%; background: ${t.color};"></span>
                <span>${t.name}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Profile details form -->
        <form id="settings-profile-form">
          <div class="auth-form-group">
            <label class="form-label" for="settings-username">Username</label>
            <input type="text" id="settings-username" class="form-input" value="${user.username}" required />
          </div>

          <div class="auth-form-group">
            <label class="form-label" for="settings-email">Email Address</label>
            <input type="email" id="settings-email" class="form-input" value="${user.email}" required />
          </div>

          <button type="submit" class="btn btn-primary" style="margin-top: 1rem; width: 100%; padding: 0.85rem;">
            Save Settings
          </button>
        </form>
      </div>
    `;
  }

  bindEvents() {
    // Tab buttons
    this.container.querySelectorAll('[data-dash-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        soundEffects.playClick();
        this.activeTab = btn.getAttribute('data-dash-tab');
        this.render();
      });
    });

    // Logout
    this.container.querySelector('#btn-dash-logout')?.addEventListener('click', () => {
      soundEffects.playClick();
      store.logout();
      showToast('Logged out successfully', 'info');
    });

    // Re-download from history
    this.container.querySelectorAll('.btn-redownload').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const wp = WALLPAPERS.find((w) => w.id === id);
        if (wp) {
          downloadWallpaper(wp, wp.resolutions[0]);
        }
      });
    });

    // Card click in favorites
    this.container.querySelectorAll('.wallpaper-card').forEach((card) => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('[data-like-id]')) return;
        const id = card.dataset.id;
        soundEffects.playClick();
        store.openWallpaperDetail(id);
      });
    });

    // Unlike in favorites tab
    this.container.querySelectorAll('[data-like-id]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        soundEffects.playHeart();
        const id = btn.getAttribute('data-like-id');
        store.toggleFavorite(id);
        showToast('Removed from favorites', 'info');
        this.render();
      });
    });

    // Avatar selector
    this.container.querySelectorAll('[data-avatar-url]').forEach((el) => {
      el.addEventListener('click', () => {
        soundEffects.playClick();
        const url = el.getAttribute('data-avatar-url');
        store.updateProfile({ avatar: url });
        showToast('Avatar updated!', 'success');
        this.render();
      });
    });

    // Theme selector
    this.container.querySelectorAll('[data-set-theme]').forEach((btn) => {
      btn.addEventListener('click', () => {
        soundEffects.playClick();
        const theme = btn.getAttribute('data-set-theme');
        store.setThemeAccent(theme);
        this.render();
      });
    });

    // Settings save form
    const form = this.container.querySelector('#settings-profile-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        soundEffects.playSuccess();
        const username = this.container.querySelector('#settings-username').value.trim();
        const email = this.container.querySelector('#settings-email').value.trim();
        store.updateProfile({ username, email });
        showToast('Profile settings saved successfully!', 'success');
      });
    }

    // Navigation links in empty states
    this.container.querySelectorAll('[data-nav]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        soundEffects.playClick();
        store.navigate(el.getAttribute('data-nav'));
      });
    });
  }
}
