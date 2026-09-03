import confetti from 'canvas-confetti';
import { store } from './store.js';
import { showToast } from '../components/Toast.js';
import { soundEffects } from './audio.js';

export async function downloadWallpaper(wallpaper, resolutionObj, onProgress = null) {
  soundEffects.playClick();

  // Resolution dimensions
  const targetWidth = resolutionObj.width || 3840;
  const targetHeight = resolutionObj.height || 2160;
  const resolutionName = resolutionObj.name || '4K Ultra HD';

  // Simulate ultra-fast modern streaming CDN download progress
  const duration = 1200; // ms
  const steps = 15;
  const stepTime = duration / steps;

  for (let i = 1; i <= steps; i++) {
    await new Promise((resolve) => setTimeout(resolve, stepTime));
    const percent = Math.round((i / steps) * 100);
    if (onProgress) onProgress(percent);
  }

  try {
    // Render high-quality canvas export
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');

    // Load source image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = wallpaper.image;

    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => {
        // Fallback: continue even if image loading fails on cross-origin
        resolve();
      };
    });

    if (img.complete && img.naturalWidth > 0) {
      // Calculate aspect fill
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const targetRatio = targetWidth / targetHeight;
      let drawW, drawH, offsetX, offsetY;

      if (imgRatio > targetRatio) {
        drawH = targetHeight;
        drawW = targetHeight * imgRatio;
        offsetX = (targetWidth - drawW) / 2;
        offsetY = 0;
      } else {
        drawW = targetWidth;
        drawH = targetWidth / imgRatio;
        offsetX = 0;
        offsetY = (targetHeight - drawH) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
    } else {
      // Background gradient fallback
      const grad = ctx.createLinearGradient(0, 0, targetWidth, targetHeight);
      grad.addColorStop(0, '#0a0d24');
      grad.addColorStop(0.5, '#16193d');
      grad.addColorStop(1, '#05060f');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, targetWidth, targetHeight);
    }

    // Add subtle futuristic watermark stamp
    ctx.save();
    ctx.font = 'bold 36px "Outfit", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.textAlign = 'right';
    ctx.fillText(`MOON_VIEW // ${wallpaper.anime.toUpperCase()} [${resolutionName.toUpperCase()}]`, targetWidth - 80, targetHeight - 70);
    ctx.restore();

    // Trigger download
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    const filename = `MOON_VIEW_${wallpaper.anime.replace(/\s+/g, '_')}_${wallpaper.title.replace(/[^a-zA-Z0-9]/g, '_')}_${resolutionName.replace(/\s+/g, '_')}.png`;
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Record in history & notify
    store.recordDownload(wallpaper, resolutionName);
    soundEffects.playSuccess();

    // Confetti effect
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#06b6d4', '#a855f7', '#ec4899', '#f59e0b']
    });

    showToast(`Downloaded "${wallpaper.title}" (${resolutionName})`, 'success');
  } catch (err) {
    console.error('Download error:', err);
    // Direct link fallback
    const a = document.createElement('a');
    a.href = wallpaper.image;
    a.download = `MOON_VIEW_${wallpaper.title}.jpg`;
    a.target = '_blank';
    a.click();
    store.recordDownload(wallpaper, resolutionName);
    showToast(`Downloaded "${wallpaper.title}" (${resolutionName})`, 'success');
  }
}
