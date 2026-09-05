import { WALLPAPERS } from '../data/wallpapers.js';
import { getAssetUrl } from '../utils/assets.js';

const SEED_USERS = [
  {
    id: 'user_otaku_demo',
    username: 'CosmicOtaku',
    email: 'otaku@moonview.io',
    password: 'password123',
    avatar: getAssetUrl('/avatars/avatar_cosmic_hero.svg'),
    rank: 'Celestial Pioneer ★★★',
    joinedDate: 'August 2026',
    downloadQuota: 100,
    downloadsUsed: 14
  },
  {
    id: 'user_vip_demo',
    username: 'AstralEmperor',
    email: 'emperor@moonview.io',
    password: 'password123',
    avatar: getAssetUrl('/avatars/avatar_cyber_glitch.svg'),
    rank: 'Celestial VIP ★★★★★',
    joinedDate: 'July 2026',
    downloadQuota: 999,
    downloadsUsed: 42
  },
  {
    id: 'user_shadow_demo',
    username: 'ShadowSovereign',
    email: 'shadow@moonview.io',
    password: 'password123',
    avatar: getAssetUrl('/avatars/avatar_shadow_ninja.svg'),
    rank: 'Dimension Creator ★★★★',
    joinedDate: 'September 2026',
    downloadQuota: 500,
    downloadsUsed: 28
  }
];

const isClient = typeof window !== 'undefined';
const storage = {
  getItem: (k) => (isClient && typeof localStorage !== 'undefined' ? localStorage.getItem(k) : null),
  setItem: (k, v) => { if (isClient && typeof localStorage !== 'undefined') localStorage.setItem(k, v); },
  removeItem: (k) => { if (isClient && typeof localStorage !== 'undefined') localStorage.removeItem(k); }
};

class AppStore {
  constructor() {
    this.listeners = new Set();

    // Load persisted state from localStorage
    const savedFavorites = storage.getItem('moon_view_favorites');
    const savedHistory = storage.getItem('moon_view_downloads');
    const savedUser = storage.getItem('moon_view_user');
    const savedTheme = storage.getItem('moon_view_theme') || 'cyan';
    const savedUsersDB = storage.getItem('moon_view_users_db');

    // User accounts database
    this.usersDB = savedUsersDB ? JSON.parse(savedUsersDB) : [...SEED_USERS];

    this.state = {
      currentView: 'home',
      detailWallpaperId: 'gojo-infinite-void',
      authTab: 'login', // 'login' | 'signup'
      user: savedUser ? JSON.parse(savedUser) : null,
      favorites: savedFavorites ? JSON.parse(savedFavorites) : ['gojo-infinite-void', 'luffy-gear-5', 'lucy-cyberpunk-moon', 'jinwoo-shadow-monarch'],
      downloadHistory: savedHistory ? JSON.parse(savedHistory) : [
        {
          id: 'dl_101',
          wallpaperId: 'gojo-infinite-void',
          wallpaperTitle: 'Infinite Void // Cosmic Horizon',
          anime: 'Jujutsu Kaisen',
          resolution: '8K Ultra Master',
          timestamp: '2 hours ago',
          image: getAssetUrl('/wallpapers/gojo_infinite_void.jpg')
        },
        {
          id: 'dl_102',
          wallpaperId: 'lucy-cyberpunk-moon',
          wallpaperTitle: 'Fly Me to the Moon // Night City',
          anime: 'Cyberpunk: Edgerunners',
          resolution: '4K Ultra HD',
          timestamp: 'Yesterday',
          image: getAssetUrl('/wallpapers/lucy_cyberpunk_moon.jpg')
        }
      ],
      searchQuery: '',
      selectedAnime: 'all',
      selectedResolution: 'all',
      selectedOrientation: 'all',
      selectedSort: 'trending', // 'trending', 'downloads', 'rating', 'newest'
      filter3DOnly: false,
      themeAccent: savedTheme,
      audioMuted: true,
      quickSearchOpen: false
    };

    // Apply active theme to document root
    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.setAttribute('data-theme-accent', this.state.themeAccent);
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((listener) => listener(this.state));
  }

  getState() {
    return this.state;
  }

  saveUsersDB() {
    storage.setItem('moon_view_users_db', JSON.stringify(this.usersDB));
  }

  authenticate(emailOrUsername, password) {
    const query = emailOrUsername.toLowerCase().trim();
    const user = this.usersDB.find(
      (u) => (u.email.toLowerCase() === query || u.username.toLowerCase() === query)
    );

    if (!user) {
      return { success: false, error: 'User account not found. Please register or check your credentials.' };
    }

    if (user.password && user.password !== password) {
      return { success: false, error: 'Invalid password. Please try again or use Forgot Password.' };
    }

    return { success: true, user };
  }

  registerUser(userData) {
    const existing = this.usersDB.find(
      (u) => u.email.toLowerCase() === userData.email.toLowerCase().trim() ||
             u.username.toLowerCase() === userData.username.toLowerCase().trim()
    );

    if (existing) {
      return { success: false, error: 'An account with this email or username already exists.' };
    }

    const newUser = {
      id: 'user_' + Date.now(),
      username: userData.username.trim(),
      email: userData.email.trim(),
      password: userData.password,
      avatar: userData.avatar || getAssetUrl('/avatars/avatar_cosmic_hero.svg'),
      rank: 'Celestial Pioneer ★★★',
      joinedDate: 'September 2026',
      downloadQuota: 100,
      downloadsUsed: 0
    };

    this.usersDB.push(newUser);
    this.saveUsersDB();
    this.login(newUser, true);
    return { success: true, user: newUser };
  }

  navigate(view, wallpaperId = null, authTab = null) {
    this.state.currentView = view;
    if (wallpaperId) {
      this.state.detailWallpaperId = wallpaperId;
    }
    if (authTab) {
      this.state.authTab = authTab;
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    this.notify();
  }

  openWallpaperDetail(wallpaperId) {
    this.state.detailWallpaperId = wallpaperId;
    this.state.currentView = 'detail';
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    this.notify();
  }

  setAuthTab(tab) {
    this.state.authTab = tab;
    this.notify();
  }

  toggleFavorite(wallpaperId) {
    const index = this.state.favorites.indexOf(wallpaperId);
    if (index === -1) {
      this.state.favorites.push(wallpaperId);
    } else {
      this.state.favorites.splice(index, 1);
    }
    storage.setItem('moon_view_favorites', JSON.stringify(this.state.favorites));
    this.notify();
    return index === -1; // true if added, false if removed
  }

  isFavorite(wallpaperId) {
    return this.state.favorites.includes(wallpaperId);
  }

  recordDownload(wallpaper, resolutionName) {
    const entry = {
      id: 'dl_' + Date.now(),
      wallpaperId: wallpaper.id,
      wallpaperTitle: wallpaper.title,
      anime: wallpaper.anime,
      resolution: resolutionName,
      timestamp: 'Just now',
      image: wallpaper.image
    };
    this.state.downloadHistory.unshift(entry);
    if (this.state.user) {
      this.state.user.downloadsUsed = (this.state.user.downloadsUsed || 0) + 1;
      storage.setItem('moon_view_user', JSON.stringify(this.state.user));
    }
    storage.setItem('moon_view_downloads', JSON.stringify(this.state.downloadHistory));
    this.notify();
  }

  login(userObj, rememberMe = true) {
    this.state.user = userObj;
    if (rememberMe) {
      storage.setItem('moon_view_user', JSON.stringify(userObj));
    }
    this.navigate('dashboard');
  }

  logout() {
    this.state.user = null;
    storage.removeItem('moon_view_user');
    this.navigate('home');
  }

  updateProfile(updates) {
    if (this.state.user) {
      this.state.user = { ...this.state.user, ...updates };
      // Also update in usersDB if exists
      const idx = this.usersDB.findIndex((u) => u.id === this.state.user.id);
      if (idx !== -1) {
        this.usersDB[idx] = { ...this.usersDB[idx], ...updates };
        this.saveUsersDB();
      }
      storage.setItem('moon_view_user', JSON.stringify(this.state.user));
      this.notify();
    }
  }

  setThemeAccent(accent) {
    this.state.themeAccent = accent;
    storage.setItem('moon_view_theme', accent);
    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.setAttribute('data-theme-accent', accent);
    }
    this.notify();
  }

  toggleAudio() {
    this.state.audioMuted = !this.state.audioMuted;
    this.notify();
    return !this.state.audioMuted;
  }

  setQuickSearch(isOpen) {
    this.state.quickSearchOpen = isOpen;
    this.notify();
  }

  setFilters(filters) {
    this.state = { ...this.state, ...filters };
    this.notify();
  }

  getFilteredWallpapers() {
    let list = [...WALLPAPERS];

    // Anime filter
    if (this.state.selectedAnime && this.state.selectedAnime !== 'all') {
      list = list.filter((wp) => wp.animeId === this.state.selectedAnime);
    }

    // Resolution filter
    if (this.state.selectedResolution && this.state.selectedResolution !== 'all') {
      if (this.state.selectedResolution === '8k') {
        list = list.filter((wp) => wp.resolutionTag.includes('8K'));
      } else if (this.state.selectedResolution === '4k') {
        list = list.filter((wp) => wp.resolutionTag.includes('4K') || wp.resolutionTag.includes('8K'));
      }
    }

    // Orientation filter
    if (this.state.selectedOrientation && this.state.selectedOrientation !== 'all') {
      list = list.filter((wp) => wp.orientation === this.state.selectedOrientation);
    }

    // 3D only filter
    if (this.state.filter3DOnly) {
      list = list.filter((wp) => wp.is3D);
    }

    // Search query
    if (this.state.searchQuery.trim()) {
      const q = this.state.searchQuery.toLowerCase().trim();
      list = list.filter((wp) => {
        return (
          wp.title.toLowerCase().includes(q) ||
          wp.anime.toLowerCase().includes(q) ||
          wp.character.toLowerCase().includes(q) ||
          wp.tags.some((t) => t.toLowerCase().includes(q))
        );
      });
    }

    // Sorting
    if (this.state.selectedSort === 'downloads') {
      list.sort((a, b) => b.downloads - a.downloads);
    } else if (this.state.selectedSort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (this.state.selectedSort === 'newest') {
      list.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    } else {
      // Default: trending
      list.sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0) || b.views - a.views);
    }

    return list;
  }

  getCurrentWallpaper() {
    return WALLPAPERS.find((wp) => wp.id === this.state.detailWallpaperId) || WALLPAPERS[0];
  }
}

export const store = new AppStore();
