import { WALLPAPERS } from '../data/wallpapers.js';
import { store } from '../services/store.js';

export class QuickSearchModal {
  constructor() {
    this.overlay = null;
    this.input = null;
    this.resultsContainer = null;
    this.init();
  }

  init() {
    this.createDom();
    this.bindEvents();
  }

  createDom() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-overlay';
    this.overlay.id = 'quick-search-modal-overlay';

    this.overlay.innerHTML = `
      <div class="quick-search-modal">
        <div style="display: flex; align-items: center; gap: 1rem; padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border-glass);">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--theme-accent)" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" class="quick-search-input" placeholder="Search anime, characters, tags (e.g. Gojo, Luffy, 8K)..." style="flex: 1; background: transparent; color: #ffffff; font-size: 1.1rem; outline: none; border: none;" />
          <button class="modal-close-btn" style="color: var(--text-muted); cursor: pointer; padding: 0.25rem;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="quick-search-results" style="max-height: 400px; overflow-y: auto; padding: 0.75rem;"></div>
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1.5rem; border-top: 1px solid var(--border-subtle); font-size: 0.75rem; color: var(--text-muted); background: rgba(0,0,0,0.25);">
          <span>Navigate with <b>↑</b> <b>↓</b>, open with <b>Enter</b></span>
          <span><b>ESC</b> to close</span>
        </div>
      </div>
    `;

    document.body.appendChild(this.overlay);
    this.input = this.overlay.querySelector('.quick-search-input');
    this.resultsContainer = this.overlay.querySelector('.quick-search-results');
  }

  bindEvents() {
    // Keyboard shortcut Cmd/Ctrl + K and Esc
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.open();
      } else if (e.key === 'Escape' && this.overlay.classList.contains('open')) {
        this.close();
      }
    });

    this.overlay.querySelector('.modal-close-btn').addEventListener('click', () => this.close());
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });

    this.input.addEventListener('input', (e) => {
      this.renderResults(e.target.value);
    });
  }

  open() {
    this.overlay.classList.add('open');
    this.input.value = '';
    this.renderResults('');
    setTimeout(() => this.input.focus(), 50);
  }

  close() {
    this.overlay.classList.remove('open');
  }

  renderResults(query) {
    const q = query.toLowerCase().trim();
    let matches = WALLPAPERS;
    if (q) {
      matches = WALLPAPERS.filter(
        (wp) =>
          wp.title.toLowerCase().includes(q) ||
          wp.anime.toLowerCase().includes(q) ||
          wp.character.toLowerCase().includes(q) ||
          wp.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (matches.length === 0) {
      this.resultsContainer.innerHTML = `
        <div style="padding: 2.5rem; text-align: center; color: var(--text-muted);">
          <p>No 3D anime wallpapers found for "${query}"</p>
        </div>
      `;
      return;
    }

    this.resultsContainer.innerHTML = matches.slice(0, 6).map((wp) => `
      <div class="search-result-item" data-id="${wp.id}" style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem 1rem; border-radius: var(--radius-md); cursor: pointer; transition: background 0.15s ease;">
        <img src="${wp.thumbnail}" style="width: 60px; height: 38px; object-fit: cover; border-radius: 6px; border: 1px solid var(--border-glass);" />
        <div style="flex: 1; min-width: 0;">
          <div style="font-weight: 700; color: #ffffff; font-size: 0.95rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${wp.title}</div>
          <div style="font-size: 0.75rem; color: var(--theme-accent); font-family: var(--font-mono);">${wp.anime} // ${wp.character}</div>
        </div>
        <span class="badge badge-cyan">${wp.resolutionTag}</span>
      </div>
    `).join('');

    // Attach click listeners to results
    this.resultsContainer.querySelectorAll('.search-result-item').forEach((item) => {
      item.addEventListener('mouseenter', () => {
        item.style.background = 'rgba(255, 255, 255, 0.08)';
      });
      item.addEventListener('mouseleave', () => {
        item.style.background = 'transparent';
      });
      item.addEventListener('click', () => {
        const id = item.dataset.id;
        this.close();
        store.openWallpaperDetail(id);
      });
    });
  }
}
