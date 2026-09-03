import { store } from '../services/store.js';
import { showToast } from './Toast.js';
import { soundEffects } from '../services/audio.js';

export class Footer {
  constructor(container) {
    this.container = container;
    this.init();
  }

  init() {
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-top-grid">
            <!-- Brand Column -->
            <div class="footer-brand-col">
              <div class="nav-brand" style="margin-bottom: 0.5rem;">
                <div class="logo-moon-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>
                </div>
                <div class="brand-text">
                  <span class="brand-title">MOON_VIEW</span>
                  <span class="brand-subtitle">STEP INTO ANOTHER DIMENSION</span>
                </div>
              </div>
              <p class="footer-desc">
                The premier destination for 3D animated anime wallpapers, parallax celestial artworks, and ultra-high-definition master renders. 100% Free & Open Creator Community.
              </p>
              <div style="display: flex; gap: 0.75rem; margin-top: 0.5rem;">
                <a href="https://discord.com" target="_blank" class="btn-icon" title="Join Discord Community">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
                </a>
                <a href="https://twitter.com" target="_blank" class="btn-icon" title="Follow on X / Twitter">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="https://github.com" target="_blank" class="btn-icon" title="View Source on GitHub">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                </a>
              </div>
            </div>

            <!-- Fast Navigation -->
            <div>
              <h4 class="footer-col-title">Navigation</h4>
              <ul class="footer-links-list">
                <li><a data-nav="home">Home Universe</a></li>
                <li><a data-nav="browse">Browse 3D Gallery</a></li>
                <li><a data-action="scroll-best-view">Best View Showcase</a></li>
                <li><a data-nav="dashboard">User Dashboard</a></li>
                <li><a data-nav="auth">Join / Sign In</a></li>
              </ul>
            </div>

            <!-- Categories -->
            <div>
              <h4 class="footer-col-title">Top Franchises</h4>
              <ul class="footer-links-list">
                <li><a data-filter-anime="jujutsu-kaisen">Jujutsu Kaisen</a></li>
                <li><a data-filter-anime="demon-slayer">Demon Slayer</a></li>
                <li><a data-filter-anime="one-piece">One Piece</a></li>
                <li><a data-filter-anime="solo-leveling">Solo Leveling</a></li>
                <li><a data-filter-anime="cyberpunk">Cyberpunk: Edgerunners</a></li>
                <li><a data-filter-anime="attack-on-titan">Attack on Titan</a></li>
              </ul>
            </div>

            <!-- Newsletter & Discord -->
            <div>
              <h4 class="footer-col-title">Cosmic Drops Newsletter</h4>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem; line-height: 1.5;">
                Get weekly drops of limited edition 8K live parallax anime wallpapers directly to your inbox.
              </p>
              <form id="footer-newsletter-form" style="display: flex; gap: 0.5rem;">
                <input type="email" id="footer-email-input" placeholder="Enter your email..." required style="flex: 1; padding: 0.65rem 1rem; border-radius: var(--radius-md); background: rgba(0,0,0,0.4); border: 1px solid var(--border-glass); color: #ffffff; font-size: 0.85rem;" />
                <button type="submit" class="btn btn-primary" style="padding: 0.65rem 1rem; font-size: 0.85rem;">
                  Join
                </button>
              </form>
            </div>
          </div>

          <!-- Bottom Legal & Status Bar -->
          <div class="footer-bottom-bar">
            <div>
              © 2026 MOON_VIEW Studio. All rights reserved. Anime characters and trademarks belong to their respective creators & studios.
            </div>
            <div style="display: flex; align-items: center; gap: 1.5rem;">
              <span style="display: inline-flex; align-items: center; gap: 0.4rem; color: #34d399; font-family: var(--font-mono); font-size: 0.75rem;">
                <span style="width: 8px; height: 8px; border-radius: 50%; background: #10b981; box-shadow: 0 0 8px #10b981;"></span>
                3D CDN Operational (99.9%)
              </span>
              <a href="#" style="color: var(--text-muted); font-size: 0.75rem;">Privacy Policy</a>
              <a href="#" style="color: var(--text-muted); font-size: 0.75rem;">Terms of Service</a>
              <a href="#" style="color: var(--text-muted); font-size: 0.75rem;">DMCA Notice</a>
            </div>
          </div>
        </div>
      </footer>
    `;

    this.bindEvents();
  }

  bindEvents() {
    this.container.querySelectorAll('[data-nav]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        soundEffects.playClick();
        store.navigate(el.getAttribute('data-nav'));
      });
    });

    this.container.querySelectorAll('[data-filter-anime]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        soundEffects.playClick();
        const anime = el.getAttribute('data-filter-anime');
        store.setFilters({ selectedAnime: anime });
        store.navigate('browse');
      });
    });

    const form = this.container.querySelector('#footer-newsletter-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        soundEffects.playSuccess();
        const emailInput = this.container.querySelector('#footer-email-input');
        if (emailInput) {
          showToast(`Welcome to the Moon View dimension, ${emailInput.value}!`, 'success');
          emailInput.value = '';
        }
      });
    }
  }
}
