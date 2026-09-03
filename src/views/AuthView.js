import { store } from '../services/store.js';
import { soundEffects } from '../services/audio.js';
import { showToast } from '../components/Toast.js';
import { getAssetUrl } from '../utils/assets.js';

export class AuthView {
  constructor(container) {
    this.container = container;
    this.activeTab = 'login'; // 'login' | 'signup'
  }

  render() {
    this.container.innerHTML = `
      <div class="view-transition-enter auth-page-container">
        <div class="auth-card">
          <!-- Logo & Header -->
          <div style="text-align: center; margin-bottom: 2rem;">
            <div class="logo-moon-icon" style="margin: 0 auto 1rem; width: 48px; height: 48px;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>
            </div>
            <h2 style="font-size: 1.8rem; font-weight: 900; letter-spacing: -0.02em;">
              ${this.activeTab === 'login' ? 'Welcome to Moon View' : 'Create Collector Account'}
            </h2>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.25rem;">
              ${this.activeTab === 'login' ? 'Access your unlimited 8K 3D anime downloads' : 'Join thousands of anime wallpaper curators'}
            </p>
          </div>

          <!-- Auth Tab Switcher -->
          <div class="auth-tabs">
            <button class="auth-tab-btn ${this.activeTab === 'login' ? 'active' : ''}" id="tab-btn-login">
              Sign In
            </button>
            <button class="auth-tab-btn ${this.activeTab === 'signup' ? 'active' : ''}" id="tab-btn-signup">
              Create Account
            </button>
          </div>

          <!-- Form Area -->
          ${this.activeTab === 'login' ? this.renderLoginForm() : this.renderSignupForm()}

          <!-- Divider -->
          <div style="display: flex; align-items: center; gap: 1rem; margin: 1.75rem 0; color: var(--text-muted); font-size: 0.75rem;">
            <div style="flex: 1; height: 1px; background: var(--border-glass);"></div>
            <span>OR CONTINUE WITH</span>
            <div style="flex: 1; height: 1px; background: var(--border-glass);"></div>
          </div>

          <!-- Social Logins -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
            <button class="btn btn-secondary btn-social" data-provider="Google" style="font-size: 0.85rem; padding: 0.65rem;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/></svg>
              Google
            </button>
            <button class="btn btn-secondary btn-social" data-provider="Discord" style="font-size: 0.85rem; padding: 0.65rem;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#5865F2"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
              Discord
            </button>
          </div>

          <!-- Quick 1-Click Demo Logins -->
          <div style="margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid var(--border-subtle);">
            <div style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono); margin-bottom: 0.5rem; text-align: center;">
              ⚡ 1-CLICK DEMO ACCOUNTS
            </div>
            <div class="demo-account-pills">
              <button class="demo-pill" id="demo-btn-otaku">
                ★ Otaku Collector
              </button>
              <button class="demo-pill" id="demo-btn-vip">
                👑 Celestial VIP
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  renderLoginForm() {
    return `
      <form id="auth-login-form">
        <div class="auth-form-group">
          <label class="form-label" for="login-email">User ID or Email</label>
          <input type="text" id="login-email" class="form-input" placeholder="e.g. otaku@moonview.io" required />
        </div>

        <div class="auth-form-group">
          <div style="display: flex; justify-content: space-between;">
            <label class="form-label" for="login-password">Password</label>
            <a href="#" id="link-forgot-pass" style="font-size: 0.75rem; color: var(--theme-accent);">Forgot?</a>
          </div>
          <input type="password" id="login-password" class="form-input" placeholder="••••••••" required />
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; font-size: 0.85rem;">
          <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-secondary);">
            <input type="checkbox" id="remember-me" checked style="accent-color: var(--theme-accent);" />
            Remember Me
          </label>
        </div>

        <div id="login-error-msg" style="color: #f43f5e; font-size: 0.8rem; margin-bottom: 1rem; display: none;"></div>

        <button type="submit" class="btn btn-primary" style="width: 100%; padding: 0.85rem; font-size: 1rem;">
          Sign In to MOON_VIEW
        </button>
      </form>
    `;
  }

  renderSignupForm() {
    return `
      <form id="auth-signup-form">
        <div class="auth-form-group">
          <label class="form-label" for="signup-username">Username</label>
          <input type="text" id="signup-username" class="form-input" placeholder="CosmicRider" required />
        </div>

        <div class="auth-form-group">
          <label class="form-label" for="signup-email">Email Address</label>
          <input type="email" id="signup-email" class="form-input" placeholder="rider@cosmos.io" required />
        </div>

        <div class="auth-form-group">
          <label class="form-label" for="signup-password">Password</label>
          <input type="password" id="signup-password" class="form-input" placeholder="Minimum 6 characters" required />
        </div>

        <div class="auth-form-group">
          <label class="form-label" for="signup-confirm">Confirm Password</label>
          <input type="password" id="signup-confirm" class="form-input" placeholder="Re-enter password" required />
        </div>

        <div id="signup-error-msg" style="color: #f43f5e; font-size: 0.8rem; margin-bottom: 1rem; display: none;"></div>

        <button type="submit" class="btn btn-primary" style="width: 100%; padding: 0.85rem; font-size: 1rem;">
          Create Free Account
        </button>
      </form>
    `;
  }

  bindEvents() {
    // Tab switching
    this.container.querySelector('#tab-btn-login')?.addEventListener('click', () => {
      soundEffects.playClick();
      this.activeTab = 'login';
      this.render();
    });

    this.container.querySelector('#tab-btn-signup')?.addEventListener('click', () => {
      soundEffects.playClick();
      this.activeTab = 'signup';
      this.render();
    });

    // Forgot password link
    this.container.querySelector('#link-forgot-pass')?.addEventListener('click', (e) => {
      e.preventDefault();
      soundEffects.playClick();
      showToast('Password reset link sent to demo registered email!', 'info');
    });

    // Login Form Submit
    const loginForm = this.container.querySelector('#auth-login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = this.container.querySelector('#login-email').value.trim();
        const pass = this.container.querySelector('#login-password').value;
        const errEl = this.container.querySelector('#login-error-msg');

        if (!email || !pass) {
          errEl.textContent = 'Please fill in both User ID and password.';
          errEl.style.display = 'block';
          return;
        }

        if (pass.length < 4) {
          errEl.textContent = 'Password must be at least 4 characters.';
          errEl.style.display = 'block';
          return;
        }

        soundEffects.playSuccess();
        store.login({
          id: 'user_' + Date.now(),
          username: email.split('@')[0] || 'CelestialExplorer',
          email: email.includes('@') ? email : `${email}@moonview.io`,
          avatar: getAssetUrl('/avatars/avatar_cosmic_hero.svg'),
          rank: 'Star Vanguard ★★',
          joinedDate: 'September 2026',
          downloadQuota: 100,
          downloadsUsed: 3
        });
        showToast(`Welcome back, ${email.split('@')[0]}!`, 'success');
      });
    }

    // Signup Form Submit
    const signupForm = this.container.querySelector('#auth-signup-form');
    if (signupForm) {
      signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = this.container.querySelector('#signup-username').value.trim();
        const email = this.container.querySelector('#signup-email').value.trim();
        const pass = this.container.querySelector('#signup-password').value;
        const confirm = this.container.querySelector('#signup-confirm').value;
        const errEl = this.container.querySelector('#signup-error-msg');

        if (pass !== confirm) {
          errEl.textContent = 'Passwords do not match!';
          errEl.style.display = 'block';
          return;
        }

        if (pass.length < 6) {
          errEl.textContent = 'Password must be at least 6 characters.';
          errEl.style.display = 'block';
          return;
        }

        soundEffects.playSuccess();
        store.login({
          id: 'user_' + Date.now(),
          username: username,
          email: email,
          avatar: getAssetUrl('/avatars/avatar_shadow_ninja.svg'),
          rank: 'Celestial Pioneer ★★★',
          joinedDate: 'September 2026',
          downloadQuota: 100,
          downloadsUsed: 0
        });
        showToast(`Welcome to MOON_VIEW, ${username}!`, 'success');
      });
    }

    // Demo Logins
    this.container.querySelector('#demo-btn-otaku')?.addEventListener('click', () => {
      soundEffects.playSuccess();
      store.login({
        id: 'otaku_demo_1',
        username: 'CosmicOtaku',
        email: 'otaku@moonview.io',
        avatar: getAssetUrl('/avatars/avatar_cosmic_hero.svg'),
        rank: 'Celestial Pioneer ★★★',
        joinedDate: 'August 2026',
        downloadQuota: 50,
        downloadsUsed: 14
      });
      showToast('Logged in as CosmicOtaku (Demo)', 'success');
    });

    this.container.querySelector('#demo-btn-vip')?.addEventListener('click', () => {
      soundEffects.playSuccess();
      store.login({
        id: 'vip_demo_2',
        username: 'AstralEmperor',
        email: 'emperor@moonview.io',
        avatar: getAssetUrl('/avatars/avatar_cyber_glitch.svg'),
        rank: 'Celestial VIP ★★★★★',
        joinedDate: 'July 2026',
        downloadQuota: 999,
        downloadsUsed: 42
      });
      showToast('Logged in as AstralEmperor (VIP Demo)', 'success');
    });

    // Social Logins
    this.container.querySelectorAll('.btn-social').forEach((btn) => {
      btn.addEventListener('click', () => {
        const provider = btn.dataset.provider;
        soundEffects.playSuccess();
        store.login({
          id: 'social_' + Date.now(),
          username: `${provider}User`,
          email: `${provider.toLowerCase()}@auth.net`,
          avatar: '/avatars/avatar_cosmic_hero.svg',
          rank: 'Verified ' + provider + ' Member',
          joinedDate: 'September 2026',
          downloadQuota: 100,
          downloadsUsed: 5
        });
        showToast(`Connected successfully with ${provider}!`, 'success');
      });
    });
  }
}
