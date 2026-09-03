import { CosmicBackground } from './components/CosmicBackground.js';
import { QuickSearchModal } from './components/QuickSearchModal.js';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { HomeView } from './views/HomeView.js';
import { BrowseView } from './views/BrowseView.js';
import { DetailView } from './views/DetailView.js';
import { AuthView } from './views/AuthView.js';
import { DashboardView } from './views/DashboardView.js';
import { store } from './services/store.js';

class App {
  constructor() {
    this.navContainer = document.getElementById('nav-container');
    this.mainContainer = document.getElementById('main-container');
    this.footerContainer = document.getElementById('footer-container');
    this.canvas = document.getElementById('cosmic-canvas');

    this.cosmicBg = null;
    this.quickSearch = null;
    this.navbar = null;
    this.footer = null;

    this.views = {
      home: new HomeView(this.mainContainer),
      browse: new BrowseView(this.mainContainer),
      detail: new DetailView(this.mainContainer),
      auth: new AuthView(this.mainContainer),
      dashboard: new DashboardView(this.mainContainer)
    };

    this.init();
  }

  init() {
    // Initialize 3D Cosmic Background
    if (this.canvas) {
      this.cosmicBg = new CosmicBackground(this.canvas);
    }

    // Initialize Global Quick Search Modal
    this.quickSearch = new QuickSearchModal();

    // Initialize Top Nav & Footer
    this.navbar = new Navbar(this.navContainer, this.quickSearch);
    this.footer = new Footer(this.footerContainer);

    // Subscribe to store state changes to re-render active view
    store.subscribe((state) => {
      this.renderView(state.currentView);
      this.syncUrlHash(state);
    });

    // Handle initial route from URL hash
    this.handleUrlHash();
    window.addEventListener('hashchange', () => this.handleUrlHash());

    // Initial render
    this.renderView(store.getState().currentView);
  }

  handleUrlHash() {
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    if (hash.startsWith('detail/')) {
      const wallpaperId = hash.replace('detail/', '');
      store.openWallpaperDetail(wallpaperId);
    } else if (['home', 'browse', 'auth', 'dashboard'].includes(hash)) {
      store.navigate(hash);
    }
  }

  syncUrlHash(state) {
    let targetHash = state.currentView;
    if (state.currentView === 'detail' && state.detailWallpaperId) {
      targetHash = `detail/${state.detailWallpaperId}`;
    }
    if (window.location.hash.slice(1) !== targetHash) {
      history.replaceState(null, '', `#${targetHash}`);
    }
  }

  renderView(viewName) {
    const view = this.views[viewName] || this.views.home;
    view.render();
  }
}

// Bootstrap Application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.__MOON_VIEW_APP__ = new App();
});
