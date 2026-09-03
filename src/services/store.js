import { WALLPAPERS } from '../data/wallpapers.js';

class AppStore {
  constructor() {
    this.listeners = new Set();

    // Load persisted state from localStorage
    const savedFavorites = localStorage.getItem('moon_view_favorites');
    const savedHistory = localStorage.getItem('moon_view_downloads');
    const savedUser = localStorage.getItem('moon_view_user');
    const savedTheme = localStorage.getItem('moon_view_theme') || 'cyan';

    this.state = {
      currentView: 'home',
      detailWallpaperId: 'gojo-infinite-void',
      authTab: 'login', // 'login' | 'signup'
      user: savedUser ? JSON.parse(savedUser) : {
        id: 'otaku_celestial_01',
        username: 'CosmicOtaku',
        email: 'collector@moonview.io',
        avatar: '/avatars/avatar_cosmic_hero.svg',
        rank: 'Celestial Pioneer ★★★',
        joinedDate: 'August 2026',
        downloadQuota: 50,
        downloadsUsed: 14
      },
      favorites: savedFavorites ? JSON.parse(savedFavorites) : ['gojo-infinite-void', 'luffy-gear-5', 'lucy-cyberpunk-moon', 'jinwoo-shadow-monarch'],
      downloadHistory: savedHistory ? JSON.parse(savedHistory) : [
        {
          id: 'dl_101',
          wallpaperId: 'gojo-infinite-void',
          wallpaperTitle: 'Infinite Void // Cosmic Horizon',
          anime: 'Jujutsu Kaisen',
          resolution: '8K Ultra Master',
          timestamp: '2 hours ago',
          image: '/wallpapers/gojo_infinite_void.jpg'
        },
        {
          id: 'dl_102',
          wallpaperId: 'lucy-cyberpunk-moon',
          wallpaperTitle: 'Fly Me to the Moon // Night City',
          anime: 'Cyberpunk: Edgerunners',
          resolution: '4K Ultra HD',
          timestamp: 'Yesterday',
          image: '/wallpapers/lucy_cyberpunk_moon.jpg'
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
    document.documentElement.setAttribute('data-theme-accent', this.state.themeAccent);
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

  navigate(view, wallpaperId = null) {
    this.state.currentView = view;
    if (wallpaperId) {
      this.state.detailWallpaperId = wallpaperId;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.notify();
  }

  openWallpaperDetail(wallpaperId) {
    this.state.detailWallpaperId = wallpaperId;
    this.state.currentView = 'detail';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.notify();
  }

  toggleFavorite(wallpaperId) {
    const index = this.state.favorites.indexOf(wallpaperId);
    if (index === -1) {
      this.state.favorites.push(wallpaperId);
    } else {
      this.state.favorites.splice(index, 1);
    }
    localStorage.setItem('moon_view_favorites', JSON.stringify(this.state.favorites));
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
      localStorage.setItem('moon_view_user', JSON.stringify(this.state.user));
    }
    localStorage.setItem('moon_view_downloads', JSON.stringify(this.state.downloadHistory));
    this.notify();
  }

  login(userObj) {
    this.state.user = userObj;
    localStorage.setItem('moon_view_user', JSON.stringify(userObj));
    this.navigate('dashboard');
  }

  logout() {
    this.state.user = null;
    localStorage.removeItem('moon_view_user');
    this.navigate('home');
  }

  updateProfile(updates) {
    if (this.state.user) {
      this.state.user = { ...this.state.user, ...updates };
      localStorage.setItem('moon_view_user', JSON.stringify(this.state.user));
      this.notify();
    }
  }

  setThemeAccent(accent) {
    this.state.themeAccent = accent;
    localStorage.setItem('moon_view_theme', accent);
    document.documentElement.setAttribute('data-theme-accent', accent);
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
