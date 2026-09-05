import { store } from '../services/store.js';
import { soundEffects } from '../services/audio.js';
import { showToast } from '../components/Toast.js';
import { getAssetUrl } from '../utils/assets.js';

export class AuthView {
  constructor(container) {
    this.container = container;
    this.showLoginPassword = false;
    this.showSignupPassword = false;
    this.showSignupConfirm = false;
    this.forgotModalOpen = false;
    this.selectedAvatar = getAssetUrl('/avatars/avatar_cosmic_hero.svg');
  }

  render() {
    const state = store.getState();
    const activeTab = state.authTab || 'login';

    this.container.innerHTML = `
      <div class="view-transition-enter auth-page-container">
        <div class="auth-card">
          <!-- Logo & Header -->
          <div style="text-align: center; margin-bottom: 2rem;">
            <div class="logo-moon-icon" style="margin: 0 auto 1.25rem; width: 54px; height: 54px;">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>
            </div>
            <h2 style="font-size: 2rem; font-weight: 900; letter-spacing: -0.02em;">
              ${activeTab === 'login' ? 'Sign In to MOON_VIEW' : 'Create Collector Account'}
            </h2>
            <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.35rem;">
              ${activeTab === 'login' 
                ? 'Access your 8K anime vault, 3D live wallpapers, and downloads' 
                : 'Join thousands of celestial anime wallpaper curators'}
            </p>
          </div>

          <!-- Auth Tab Switcher -->
          <div class="auth-tabs">
            <button class="auth-tab-btn ${activeTab === 'login' ? 'active' : ''}" id="tab-btn-login">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
              Sign In
            </button>
            <button class="auth-tab-btn ${activeTab === 'signup' ? 'active' : ''}" id="tab-btn-signup">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
              Create Account
            </button>
          </div>

          <!-- Form Area -->
          ${activeTab === 'login' ? this.renderLoginForm() : this.renderSignupForm()}

          <!-- Divider -->
          <div style="display: flex; align-items: center; gap: 1rem; margin: 1.75rem 0; color: var(--text-muted); font-size: 0.75rem; font-family: var(--font-mono);">
            <div style="flex: 1; height: 1px; background: var(--border-glass);"></div>
            <span>OR QUICK CONNECT WITH</span>
            <div style="flex: 1; height: 1px; background: var(--border-glass);"></div>
          </div>

          <!-- Social Logins -->
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.6rem;">
            <button class="btn btn-secondary btn-social" data-provider="Google" title="Sign in with Google" style="padding: 0.65rem; border-radius: var(--radius-md);">
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/></svg>
            </button>
            <button class="btn btn-secondary btn-social" data-provider="Discord" title="Sign in with Discord" style="padding: 0.65rem; border-radius: var(--radius-md);">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#5865F2"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
            </button>
            <button class="btn btn-secondary btn-social" data-provider="GitHub" title="Sign in with GitHub" style="padding: 0.65rem; border-radius: var(--radius-md);">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            </button>
            <button class="btn btn-secondary btn-social" data-provider="Twitter" title="Sign in with Twitter / X" style="padding: 0.65rem; border-radius: var(--radius-md);">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#1DA1F2"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </button>
          </div>

          <!-- Quick 1-Click Demo Logins -->
          <div style="margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid var(--border-subtle);">
            <div style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono); margin-bottom: 0.6rem; text-align: center;">
              ⚡ 1-CLICK INSTANT DEMO ACCOUNTS
            </div>
            <div class="demo-account-pills">
              <button class="demo-pill" id="demo-btn-otaku">
                <span>★ Otaku Collector</span>
                <span class="demo-pill-rank">Free Plan</span>
              </button>
              <button class="demo-pill" id="demo-btn-vip">
                <span>👑 Celestial VIP</span>
                <span class="demo-pill-rank">Unlimited 8K</span>
              </button>
              <button class="demo-pill" id="demo-btn-shadow">
                <span>⚡ Shadow Creator</span>
                <span class="demo-pill-rank">Creator Pro</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Forgot Password Modal Popup -->
      ${this.renderForgotModal()}
    `;

    this.bindEvents();
  }

  renderLoginForm() {
    return `
      <form id="auth-login-form">
        <div id="login-alert-box" style="display: none;"></div>

        <div class="auth-form-group">
          <label class="form-label" for="login-email">
            <span>Email or Username</span>
          </label>
          <div class="auth-input-wrapper">
            <input type="text" id="login-email" class="form-input" placeholder="e.g. otaku@moonview.io or CosmicOtaku" required autocomplete="username" />
          </div>
        </div>

        <div class="auth-form-group">
          <label class="form-label" for="login-password">
            <span>Password</span>
            <a href="#" id="link-forgot-pass" style="color: var(--theme-accent); font-size: 0.75rem; font-weight: 600;">Forgot Password?</a>
          </label>
          <div class="auth-input-wrapper">
            <input type="${this.showLoginPassword ? 'text' : 'password'}" id="login-password" class="form-input" placeholder="Enter your password" required autocomplete="current-password" />
            <button type="button" class="btn-toggle-pw" id="btn-toggle-login-pw" title="${this.showLoginPassword ? 'Hide password' : 'Show password'}">
              ${this.showLoginPassword 
                ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
                : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>`
              }
            </button>
          </div>
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; font-size: 0.85rem;">
          <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-secondary); user-select: none;">
            <input type="checkbox" id="login-remember" checked style="accent-color: var(--theme-accent); width: 16px; height: 16px;" />
            Remember Me
          </label>
        </div>

        <button type="submit" class="btn btn-primary" id="btn-login-submit" style="width: 100%; padding: 0.85rem; font-size: 1rem;">
          <span>Sign In to MOON_VIEW</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
        </button>
      </form>
    `;
  }

  renderSignupForm() {
    const avatars = [
      { url: getAssetUrl('/avatars/avatar_cosmic_hero.svg'), label: 'Cosmic Hero' },
      { url: getAssetUrl('/avatars/avatar_shadow_ninja.svg'), label: 'Shadow Ninja' },
      { url: getAssetUrl('/avatars/avatar_cyber_glitch.svg'), label: 'Cyber Glitch' }
    ];

    return `
      <form id="auth-signup-form">
        <div id="signup-alert-box" style="display: none;"></div>

        <!-- Avatar Choice -->
        <div class="signup-avatar-group">
          <label class="form-label">
            <span>Choose Your Avatar</span>
          </label>
          <div class="signup-avatar-grid">
            ${avatars.map((av) => `
              <div class="signup-avatar-card ${this.selectedAvatar === av.url ? 'selected' : ''}" data-avatar="${av.url}">
                <img src="${av.url}" alt="${av.label}" />
                <span class="signup-avatar-label">${av.label}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="auth-form-group">
          <label class="form-label" for="signup-username">Username</label>
          <div class="auth-input-wrapper">
            <input type="text" id="signup-username" class="form-input" placeholder="e.g. AstralCurator" required autocomplete="username" />
          </div>
        </div>

        <div class="auth-form-group">
          <label class="form-label" for="signup-email">Email Address</label>
          <div class="auth-input-wrapper">
            <input type="email" id="signup-email" class="form-input" placeholder="e.g. curator@cosmos.io" required autocomplete="email" />
          </div>
        </div>

        <div class="auth-form-group">
          <label class="form-label" for="signup-password">Password</label>
          <div class="auth-input-wrapper">
            <input type="${this.showSignupPassword ? 'text' : 'password'}" id="signup-password" class="form-input" placeholder="Minimum 6 characters" required autocomplete="new-password" />
            <button type="button" class="btn-toggle-pw" id="btn-toggle-signup-pw" title="${this.showSignupPassword ? 'Hide password' : 'Show password'}">
              ${this.showSignupPassword 
                ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
                : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>`
              }
            </button>
          </div>
        </div>

        <!-- Password Strength Meter -->
        <div class="pw-strength-container" id="pw-strength-box" style="display: none;">
          <div class="pw-strength-track">
            <div class="pw-strength-fill" id="pw-strength-fill"></div>
          </div>
          <div class="pw-strength-text" id="pw-strength-label">Password Strength: Weak</div>
        </div>

        <div class="auth-form-group">
          <label class="form-label" for="signup-confirm">Confirm Password</label>
          <div class="auth-input-wrapper">
            <input type="${this.showSignupConfirm ? 'text' : 'password'}" id="signup-confirm" class="form-input" placeholder="Re-enter your password" required autocomplete="new-password" />
            <button type="button" class="btn-toggle-pw" id="btn-toggle-signup-confirm" title="${this.showSignupConfirm ? 'Hide password' : 'Show password'}">
              ${this.showSignupConfirm 
                ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
                : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>`
              }
            </button>
          </div>
        </div>

        <div style="margin-bottom: 1.5rem; font-size: 0.8rem; color: var(--text-secondary);">
          <label style="display: flex; align-items: flex-start; gap: 0.5rem; cursor: pointer;">
            <input type="checkbox" id="signup-terms" checked required style="accent-color: var(--theme-accent); margin-top: 3px;" />
            <span>I agree to the Community Guidelines and Free Anime Wallpaper License</span>
          </label>
        </div>

        <button type="submit" class="btn btn-primary" id="btn-signup-submit" style="width: 100%; padding: 0.85rem; font-size: 1rem;">
          <span>Create Free Collector Account</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
        </button>
      </form>
    `;
  }

  renderForgotModal() {
    return `
      <div class="modal-overlay ${this.forgotModalOpen ? 'open' : ''}" id="forgot-modal-overlay">
        <div class="modal-reset-card">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem;">
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <div class="logo-moon-icon" style="width: 32px; height: 32px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>
              </div>
              <h3 style="font-size: 1.3rem; font-weight: 800;">Password Recovery</h3>
            </div>
            <button id="btn-close-forgot-modal" style="color: var(--text-muted); cursor: pointer; padding: 0.25rem;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.5rem; line-height: 1.6;">
            Enter your registered collector email or username. We'll generate a direct Celestial Recovery Code for your account.
          </p>

          <form id="forgot-password-form">
            <div id="forgot-alert-box" style="display: none;"></div>

            <div class="auth-form-group">
              <label class="form-label" for="forgot-email-input">Account Email / Username</label>
              <input type="text" id="forgot-email-input" class="form-input" placeholder="e.g. otaku@moonview.io" required />
            </div>

            <button type="submit" class="btn btn-primary" id="btn-send-reset-code" style="width: 100%; padding: 0.8rem; margin-top: 0.5rem;">
              <span>Send Recovery Code</span>
            </button>
          </form>
        </div>
      </div>
    `;
  }

  bindEvents() {
    // Tab switching
    this.container.querySelector('#tab-btn-login')?.addEventListener('click', () => {
      soundEffects.playClick();
      store.setAuthTab('login');
      this.render();
    });

    this.container.querySelector('#tab-btn-signup')?.addEventListener('click', () => {
      soundEffects.playClick();
      store.setAuthTab('signup');
      this.render();
    });

    // Password visibility toggles
    this.container.querySelector('#btn-toggle-login-pw')?.addEventListener('click', () => {
      this.showLoginPassword = !this.showLoginPassword;
      const input = this.container.querySelector('#login-password');
      if (input) input.type = this.showLoginPassword ? 'text' : 'password';
      this.render();
    });

    this.container.querySelector('#btn-toggle-signup-pw')?.addEventListener('click', () => {
      this.showSignupPassword = !this.showSignupPassword;
      const input = this.container.querySelector('#signup-password');
      if (input) input.type = this.showSignupPassword ? 'text' : 'password';
      this.render();
    });

    this.container.querySelector('#btn-toggle-signup-confirm')?.addEventListener('click', () => {
      this.showSignupConfirm = !this.showSignupConfirm;
      const input = this.container.querySelector('#signup-confirm');
      if (input) input.type = this.showSignupConfirm ? 'text' : 'password';
      this.render();
    });

    // Avatar card selector
    this.container.querySelectorAll('.signup-avatar-card').forEach((card) => {
      card.addEventListener('click', () => {
        soundEffects.playClick();
        this.selectedAvatar = card.dataset.avatar;
        this.container.querySelectorAll('.signup-avatar-card').forEach((c) => c.classList.remove('selected'));
        card.classList.add('selected');
      });
    });

    // Password strength input handler
    const signupPwInput = this.container.querySelector('#signup-password');
    if (signupPwInput) {
      signupPwInput.addEventListener('input', (e) => {
        const val = e.target.value;
        const box = this.container.querySelector('#pw-strength-box');
        const fill = this.container.querySelector('#pw-strength-fill');
        const label = this.container.querySelector('#pw-strength-label');

        if (!val) {
          if (box) box.style.display = 'none';
          return;
        }

        if (box) box.style.display = 'flex';
        let score = 0;
        if (val.length >= 6) score += 1;
        if (val.length >= 10) score += 1;
        if (/[A-Z]/.test(val) && /[0-9]/.test(val)) score += 1;
        if (/[^A-Za-z0-9]/.test(val)) score += 1;

        if (score <= 1) {
          if (fill) { fill.style.width = '30%'; fill.style.background = '#f43f5e'; }
          if (label) { label.textContent = 'Password Strength: Weak'; label.style.color = '#f43f5e'; }
        } else if (score === 2 || score === 3) {
          if (fill) { fill.style.width = '65%'; fill.style.background = '#f59e0b'; }
          if (label) { label.textContent = 'Password Strength: Good'; label.style.color = '#f59e0b'; }
        } else {
          if (fill) { fill.style.width = '100%'; fill.style.background = '#10b981'; }
          if (label) { label.textContent = 'Password Strength: Celestial Master (Strong)'; label.style.color = '#10b981'; }
        }
      });
    }

    // Forgot Password Modal Triggers
    this.container.querySelector('#link-forgot-pass')?.addEventListener('click', (e) => {
      e.preventDefault();
      soundEffects.playClick();
      this.forgotModalOpen = true;
      this.render();
    });

    this.container.querySelector('#btn-close-forgot-modal')?.addEventListener('click', () => {
      soundEffects.playClick();
      this.forgotModalOpen = false;
      this.render();
    });

    this.container.querySelector('#forgot-modal-overlay')?.addEventListener('click', (e) => {
      if (e.target.id === 'forgot-modal-overlay') {
        this.forgotModalOpen = false;
        this.render();
      }
    });

    // Forgot Password Form Submit
    const forgotForm = this.container.querySelector('#forgot-password-form');
    if (forgotForm) {
      forgotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailVal = this.container.querySelector('#forgot-email-input').value.trim();
        const alertBox = this.container.querySelector('#forgot-alert-box');
        const submitBtn = this.container.querySelector('#btn-send-reset-code');

        if (!emailVal) return;

        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Sending Code...</span>`;

        setTimeout(() => {
          soundEffects.playSuccess();
          const code = Math.floor(100000 + Math.random() * 900000);
          alertBox.className = 'auth-alert auth-alert-success';
          alertBox.innerHTML = `
            <div>
              <b>Recovery Code: #${code}</b><br/>
              A reset link was simulated for <i>${emailVal}</i>. Use password: <b>password123</b> to log in.
            </div>
          `;
          alertBox.style.display = 'flex';
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<span>Code Generated!</span>`;
          showToast(`Recovery Code #${code} generated for ${emailVal}`, 'success');
        }, 600);
      });
    }

    // Login Form Submit
    const loginForm = this.container.querySelector('#auth-login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailOrUser = this.container.querySelector('#login-email').value.trim();
        const password = this.container.querySelector('#login-password').value;
        const rememberMe = this.container.querySelector('#login-remember')?.checked;
        const alertBox = this.container.querySelector('#login-alert-box');
        const submitBtn = this.container.querySelector('#btn-login-submit');

        if (!emailOrUser || !password) {
          alertBox.className = 'auth-alert auth-alert-error';
          alertBox.textContent = 'Please provide both User ID / Email and password.';
          alertBox.style.display = 'flex';
          return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="spin-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
          <span>Authenticating...</span>
        `;

        setTimeout(() => {
          const result = store.authenticate(emailOrUser, password);
          if (!result.success) {
            soundEffects.playClick();
            alertBox.className = 'auth-alert auth-alert-error';
            alertBox.textContent = result.error;
            alertBox.style.display = 'flex';
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<span>Sign In to MOON_VIEW</span>`;
            return;
          }

          soundEffects.playSuccess();
          store.login(result.user, rememberMe);
          showToast(`Welcome back, ${result.user.username}!`, 'success');
        }, 500);
      });
    }

    // Signup Form Submit
    const signupForm = this.container.querySelector('#auth-signup-form');
    if (signupForm) {
      signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = this.container.querySelector('#signup-username').value.trim();
        const email = this.container.querySelector('#signup-email').value.trim();
        const password = this.container.querySelector('#signup-password').value;
        const confirm = this.container.querySelector('#signup-confirm').value;
        const alertBox = this.container.querySelector('#signup-alert-box');
        const submitBtn = this.container.querySelector('#btn-signup-submit');

        if (!username || !email || !password) {
          alertBox.className = 'auth-alert auth-alert-error';
          alertBox.textContent = 'Please fill in all required fields.';
          alertBox.style.display = 'flex';
          return;
        }

        if (password.length < 6) {
          alertBox.className = 'auth-alert auth-alert-error';
          alertBox.textContent = 'Password must be at least 6 characters long.';
          alertBox.style.display = 'flex';
          return;
        }

        if (password !== confirm) {
          alertBox.className = 'auth-alert auth-alert-error';
          alertBox.textContent = 'Passwords do not match! Please verify.';
          alertBox.style.display = 'flex';
          return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="spin-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
          <span>Creating Celestial Account...</span>
        `;

        setTimeout(() => {
          const regResult = store.registerUser({
            username,
            email,
            password,
            avatar: this.selectedAvatar
          });

          if (!regResult.success) {
            soundEffects.playClick();
            alertBox.className = 'auth-alert auth-alert-error';
            alertBox.textContent = regResult.error;
            alertBox.style.display = 'flex';
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<span>Create Free Collector Account</span>`;
            return;
          }

          soundEffects.playSuccess();
          showToast(`Welcome to MOON_VIEW, ${username}! Your account is ready.`, 'success');
        }, 600);
      });
    }

    // 1-Click Demo Logins
    this.container.querySelector('#demo-btn-otaku')?.addEventListener('click', () => {
      soundEffects.playSuccess();
      store.login({
        id: 'user_otaku_demo',
        username: 'CosmicOtaku',
        email: 'otaku@moonview.io',
        avatar: getAssetUrl('/avatars/avatar_cosmic_hero.svg'),
        rank: 'Celestial Pioneer ★★★',
        joinedDate: 'August 2026',
        downloadQuota: 100,
        downloadsUsed: 14
      }, true);
      showToast('Logged in as CosmicOtaku (Collector Demo)', 'success');
    });

    this.container.querySelector('#demo-btn-vip')?.addEventListener('click', () => {
      soundEffects.playSuccess();
      store.login({
        id: 'user_vip_demo',
        username: 'AstralEmperor',
        email: 'emperor@moonview.io',
        avatar: getAssetUrl('/avatars/avatar_cyber_glitch.svg'),
        rank: 'Celestial VIP ★★★★★',
        joinedDate: 'July 2026',
        downloadQuota: 999,
        downloadsUsed: 42
      }, true);
      showToast('Logged in as AstralEmperor (VIP Demo ★★★★★)', 'success');
    });

    this.container.querySelector('#demo-btn-shadow')?.addEventListener('click', () => {
      soundEffects.playSuccess();
      store.login({
        id: 'user_shadow_demo',
        username: 'ShadowSovereign',
        email: 'shadow@moonview.io',
        avatar: getAssetUrl('/avatars/avatar_shadow_ninja.svg'),
        rank: 'Dimension Creator ★★★★',
        joinedDate: 'September 2026',
        downloadQuota: 500,
        downloadsUsed: 28
      }, true);
      showToast('Logged in as ShadowSovereign (Creator Demo)', 'success');
    });

    // Social Logins Simulation
    this.container.querySelectorAll('.btn-social').forEach((btn) => {
      btn.addEventListener('click', () => {
        const provider = btn.dataset.provider;
        soundEffects.playSuccess();
        const fakeUsername = `${provider}Astral_${Math.floor(100 + Math.random() * 900)}`;
        store.login({
          id: `social_${provider.toLowerCase()}_${Date.now()}`,
          username: fakeUsername,
          email: `${fakeUsername.toLowerCase()}@${provider.toLowerCase()}.com`,
          avatar: getAssetUrl('/avatars/avatar_cosmic_hero.svg'),
          rank: `Verified ${provider} Celestial`,
          joinedDate: 'September 2026',
          downloadQuota: 150,
          downloadsUsed: 2
        }, true);
        showToast(`Connected successfully via ${provider}!`, 'success');
      });
    });
  }
}
