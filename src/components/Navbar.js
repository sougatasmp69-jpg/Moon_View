import { store } from '../services/store.js';
import { soundEffects } from '../services/audio.js';
import { showToast } from './Toast.js';

export class Navbar {
  constructor(container, quickSearch) {
    this.container = container;
    this.quickSearch = quickSearch;
    this.mobileOpen = false;
    this.userMenuOpen = false;
    this.init();
  }

  init() {
    this.render();
    store.subscribe(() => this.render());

    window.addEventListener('scroll', () => {
      const nav = this.container.querySelector('.navbar');
      if (nav) {
        if (window.scrollY > 20) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
      }
    });

    // Close user dropdown if clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-user-wrapper') && this.userMenuOpen) {
        this.userMenuOpen = false;
        const dropdown = this.container.querySelector('.nav-user-dropdown');
        if (dropdown) dropdown.classList.remove('open');
      }
    });
  }

  render() {
    const state = store.getState();
    const user = state.user;
    const favCount = state.favorites.length;
    const currentView = state.currentView;

    this.container.innerHTML = `
      <header class="navbar">
        <div class="container nav-container">
          <!-- Logo & Brand -->
          <a class="nav-brand" data-nav="home">
            <div class="logo-moon-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>
            </div>
            <div class="brand-text">
              <span class="brand-title">MOON_VIEW</span>
              <span class="brand-subtitle">3D ANIME VAULT</span>
            </div>
          </a>

          <!-- Desktop Nav Links -->
          <ul class="nav-links">
            <li><a class="nav-link ${currentView === 'home' ? 'active' : ''}" data-nav="home">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
              Home
            </a></li>
            <li><a class="nav-link ${currentView === 'browse' ? 'active' : ''}" data-nav="browse">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="7" height="7" x="3" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="14" rx="1"></rect><rect width="7" height="7" x="3" y="14" rx="1"></rect></svg>
              Browse Gallery
            </a></li>
            <li><a class="nav-link" data-action="scroll-best-view">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              Best View VIP
            </a></li>
            ${user ? `
              <li><a class="nav-link ${currentView === 'dashboard' ? 'active' : ''}" data-nav="dashboard">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                Dashboard
              </a></li>
            ` : ''}
          </ul>

          <!-- Nav Right Actions -->
          <div class="nav-actions">
            <!-- Search Trigger -->
            <button class="nav-search-trigger" id="btn-quick-search-trigger" title="Quick Search (Cmd+K)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <span>Search Anime...</span>
              <span class="search-kbd-badge">⌘K</span>
            </button>

            <!-- Audio Ambient Toggle -->
            <button class="btn-icon ${!state.audioMuted ? 'active' : ''}" id="btn-audio-toggle" title="${state.audioMuted ? 'Unmute Ambient Sound' : 'Mute Ambient Sound'}">
              ${!state.audioMuted 
                ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>`
                : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`
              }
            </button>

            <!-- Theme Accent Cycle -->
            <button class="btn-icon" id="btn-theme-cycle" title="Change Theme Accent Glow (Cyan / Purple / Pink / Gold)">
              <div style="width: 14px; height: 14px; border-radius: 50%; background: var(--theme-gradient); box-shadow: 0 0 8px var(--theme-accent-glow);"></div>
            </button>

            <!-- Favorites Counter -->
            <button class="btn-icon ${favCount > 0 ? 'active' : ''}" id="btn-nav-favorites" title="My Liked Wallpapers (${favCount})">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="${favCount > 0 ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
            </button>

            <!-- User Auth / Dropdown Menu -->
            ${user ? `
              <div class="nav-user-wrapper">
                <div class="nav-user-pill" id="btn-nav-user-toggle" title="User Menu">
                  <img src="${user.avatar}" class="nav-avatar-img" alt="avatar" />
                  <span class="nav-username-text">${user.username}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m6 9 6 6 6-6"></path></svg>
                </div>

                <div class="nav-user-dropdown ${this.userMenuOpen ? 'open' : ''}">
                  <div class="nav-dropdown-header">
                    <div class="nav-dropdown-name">${user.username}</div>
                    <div class="nav-dropdown-email">${user.email}</div>
                    <div style="margin-top: 0.35rem;"><span class="badge badge-purple" style="font-size: 0.65rem;">${user.rank}</span></div>
                  </div>
                  <div class="nav-dropdown-item" data-nav="dashboard">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    <span>My Dashboard</span>
                  </div>
                  <div class="nav-dropdown-item" data-action="nav-user-favs">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
                    <span>Liked Wallpapers (${favCount})</span>
                  </div>
                  <div class="nav-dropdown-item" data-action="nav-user-theme">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>
                    <span>Switch Theme Glow</span>
                  </div>
                  <div style="height: 1px; background: var(--border-subtle); margin: 0.25rem 0;"></div>
                  <div class="nav-dropdown-item danger" id="btn-nav-logout">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    <span>Sign Out</span>
                  </div>
                </div>
              </div>
            ` : `
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <button class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.85rem;" data-auth-action="login">
                  Sign In
                </button>
                <button class="btn btn-primary" style="padding: 0.5rem 1.15rem; font-size: 0.85rem;" data-auth-action="signup">
                  Register
                </button>
              </div>
            `}

            <!-- Mobile Hamburger Toggle -->
            <button class="btn-icon mobile-menu-btn" id="btn-mobile-toggle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>
            </button>
          </div>
        </div>

        <!-- Mobile Drawer Menu -->
        <div class="mobile-drawer ${this.mobileOpen ? 'open' : ''}" style="display: ${this.mobileOpen ? 'flex' : 'none'}; flex-direction: column; gap: 1rem; padding: 1.5rem; background: var(--bg-card); border-bottom: 1px solid var(--border-neon);">
          <a class="nav-link" data-nav="home">Home</a>
          <a class="nav-link" data-nav="browse">Browse Gallery</a>
          <a class="nav-link" data-action="scroll-best-view">Best View VIP</a>
          ${user ? `
            <a class="nav-link" data-nav="dashboard">Dashboard (${user.username})</a>
            <a class="nav-link" id="btn-mobile-logout" style="color: #f43f5e;">Sign Out</a>
          ` : `
            <a class="nav-link" data-auth-action="login">Sign In</a>
            <a class="nav-link" data-auth-action="signup">Create Account</a>
          `}
        </div>
      </header>
    `;

    this.bindEvents();
  }

  bindEvents() {
    // Navigation clicks
    this.container.querySelectorAll('[data-nav]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = el.getAttribute('data-nav');
        soundEffects.playClick();
        this.mobileOpen = false;
        this.userMenuOpen = false;
        store.navigate(targetView);
      });
    });

    // Auth direct buttons (login vs signup)
    this.container.querySelectorAll('[data-auth-action]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = el.getAttribute('data-auth-action');
        soundEffects.playClick();
        this.mobileOpen = false;
        store.navigate('auth', null, tab);
      });
    });

    // User dropdown toggle
    const userToggle = this.container.querySelector('#btn-nav-user-toggle');
    if (userToggle) {
      userToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        soundEffects.playClick();
        this.userMenuOpen = !this.userMenuOpen;
        const dropdown = this.container.querySelector('.nav-user-dropdown');
        if (dropdown) dropdown.classList.toggle('open', this.userMenuOpen);
      });
    }

    // User dropdown items
    this.container.querySelector('[data-action="nav-user-favs"]')?.addEventListener('click', () => {
      soundEffects.playClick();
      this.userMenuOpen = false;
      store.navigate('dashboard');
    });

    this.container.querySelector('[data-action="nav-user-theme"]')?.addEventListener('click', () => {
      soundEffects.playClick();
      const currentTheme = store.getState().themeAccent;
      const themes = ['cyan', 'purple', 'pink', 'gold'];
      const nextTheme = themes[(themes.indexOf(currentTheme) + 1) % themes.length];
      store.setThemeAccent(nextTheme);
      showToast(`Neon Theme switched to ${nextTheme.toUpperCase()}`, 'info');
    });

    // Logout triggers
    const handleLogout = () => {
      soundEffects.playClick();
      this.userMenuOpen = false;
      this.mobileOpen = false;
      store.logout();
      showToast('Signed out of MOON_VIEW', 'info');
    };

    this.container.querySelector('#btn-nav-logout')?.addEventListener('click', handleLogout);
    this.container.querySelector('#btn-mobile-logout')?.addEventListener('click', handleLogout);

    // Best view scroll
    this.container.querySelectorAll('[data-action="scroll-best-view"]').forEach((el) => {
      el.addEventListener('click', () => {
        soundEffects.playClick();
        this.mobileOpen = false;
        this.userMenuOpen = false;
        if (store.getState().currentView !== 'home') {
          store.navigate('home');
          setTimeout(() => {
            const section = document.getElementById('best-view-showcase');
            if (section) section.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        } else {
          const section = document.getElementById('best-view-showcase');
          if (section) section.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Search trigger
    const searchBtn = this.container.querySelector('#btn-quick-search-trigger');
    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        soundEffects.playClick();
        if (this.quickSearch) this.quickSearch.open();
      });
    }

    // Audio toggle
    const audioBtn = this.container.querySelector('#btn-audio-toggle');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        const isUnmuted = store.toggleAudio();
        soundEffects.toggleAmbient(isUnmuted);
        if (isUnmuted) soundEffects.playClick();
      });
    }

    // Theme cycle (cyan -> purple -> pink -> gold)
    const themeBtn = this.container.querySelector('#btn-theme-cycle');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        soundEffects.playClick();
        const currentTheme = store.getState().themeAccent;
        const themes = ['cyan', 'purple', 'pink', 'gold'];
        const nextTheme = themes[(themes.indexOf(currentTheme) + 1) % themes.length];
        store.setThemeAccent(nextTheme);
      });
    }

    // Nav favorites click -> open dashboard favorites or browse
    const favBtn = this.container.querySelector('#btn-nav-favorites');
    if (favBtn) {
      favBtn.addEventListener('click', () => {
        soundEffects.playClick();
        if (store.getState().user) {
          store.navigate('dashboard');
        } else {
          store.navigate('browse');
        }
      });
    }

    // Mobile menu toggle
    const mobileBtn = this.container.querySelector('#btn-mobile-toggle');
    if (mobileBtn) {
      mobileBtn.addEventListener('click', () => {
        this.mobileOpen = !this.mobileOpen;
        this.render();
      });
    }
  }
}
