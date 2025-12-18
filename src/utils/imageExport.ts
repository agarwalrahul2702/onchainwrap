import html2canvas from 'html2canvas';
import { toPng } from 'html-to-image';

export interface ExportOptions {
  pixelRatio?: number;
  backgroundColor?: string | null;
}

// Detect iOS/mobile
const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent));
};

export const isMobile = (): boolean => {
  return isIOS() || /Android/i.test(navigator.userAgent);
};

/**
 * Waits for all fonts to be fully loaded
 */
const waitForFonts = async (): Promise<void> => {
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }
  // Additional small delay to ensure fonts are rendered
  await new Promise(resolve => setTimeout(resolve, 100));
};

/**
 * Waits for all images in an element to be fully loaded
 */
const waitForImages = async (element: HTMLElement): Promise<void> => {
  const images = element.querySelectorAll('img');
  const imagePromises = Array.from(images).map((img) => {
    if (img.complete && img.naturalHeight !== 0) {
      return Promise.resolve();
    }
    return new Promise<void>((resolve) => {
      img.onload = () => resolve();
      img.onerror = () => resolve(); // Don't fail on broken images
    });
  });
  await Promise.all(imagePromises);
};

/**
 * Captures a DOM element as a PNG blob using html-to-image (for web)
 */
const captureWithHtmlToImage = async (
  element: HTMLElement,
  options: ExportOptions = {}
): Promise<Blob> => {
  const { pixelRatio = 3, backgroundColor = '#0a1628' } = options;

  await waitForFonts();
  await waitForImages(element);

  // Get the actual dimensions to prevent clipping
  const rect = element.getBoundingClientRect();
  const width = element.offsetWidth || element.scrollWidth || rect.width;
  const height = element.offsetHeight || element.scrollHeight || rect.height;

  const dataUrl = await toPng(element, {
    pixelRatio,
    backgroundColor: backgroundColor || undefined,
    cacheBust: true,
    width,
    height,
    style: {
      transform: 'none',
      transformOrigin: 'top left',
    },
    canvasWidth: width * pixelRatio,
    canvasHeight: height * pixelRatio,
  });

  // Convert data URL to blob
  const response = await fetch(dataUrl);
  return response.blob();
};

/**
 * Captures a DOM element as a PNG blob using html2canvas (for mobile)
 */
const captureWithHtml2Canvas = async (
  element: HTMLElement,
  options: ExportOptions = {}
): Promise<Blob> => {
  const { pixelRatio = 3, backgroundColor = '#0a1628' } = options;

  await waitForFonts();
  await waitForImages(element);

  const canvas = await html2canvas(element, {
    scale: pixelRatio,
    backgroundColor,
    useCORS: true,
    allowTaint: false,
    logging: false,
    imageTimeout: 15000,
    width: element.offsetWidth,
    height: element.offsetHeight,
    windowWidth: element.offsetWidth,
    windowHeight: element.offsetHeight,
  });

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob'));
        }
      },
      'image/png',
      1.0
    );
  });
};

/**
 * Captures a DOM element as a PNG blob
 * Uses html-to-image for web (better CSS support)
 * Uses html2canvas for mobile (better compatibility)
 */
export const captureElementAsBlob = async (
  element: HTMLElement,
  options: ExportOptions = {}
): Promise<Blob> => {
  if (isMobile()) {
    return captureWithHtml2Canvas(element, options);
  }
  return captureWithHtmlToImage(element, options);
};

const loadBlobAsImage = async (blob: Blob): Promise<HTMLImageElement> => {
  const url = URL.createObjectURL(blob);
  try {
    const img = new Image();
    img.decoding = 'async';
    img.loading = 'eager';
    const loaded = new Promise<HTMLImageElement>((resolve, reject) => {
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image blob'));
    });
    img.src = url;
    return await loaded;
  } finally {
    URL.revokeObjectURL(url);
  }
};

/**
 * Downscales + JPEG-compresses an image blob to improve X/Twitter link-preview reliability.
 * Kept intentionally simple: fixed defaults tuned for fast unfurling.
 */
export const optimizeImageForShare = async (
  blob: Blob
): Promise<Blob> => {
  const SKIP_IF_UNDER_BYTES = 450_000; // ~450KB
  const MAX_DIMENSION = 1200;
  const BACKGROUND = '#0a1628';

  if (blob.size > 0 && blob.size <= SKIP_IF_UNDER_BYTES) {
    return blob;
  }

  const img = await loadBlobAsImage(blob);
  const srcW = img.naturalWidth || img.width;
  const srcH = img.naturalHeight || img.height;
  if (!srcW || !srcH) return blob;

  const scale = Math.min(1, MAX_DIMENSION / srcW, MAX_DIMENSION / srcH);
  const outW = Math.max(1, Math.round(srcW * scale));
  const outH = Math.max(1, Math.round(srcH * scale));

  const canvas = document.createElement('canvas');
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext('2d');
  if (!ctx) return blob;

  // Flatten transparency onto a solid background (helps keep output deterministic).
  ctx.fillStyle = BACKGROUND;
  ctx.fillRect(0, 0, outW, outH);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, outW, outH);

  const outBlob = await new Promise<Blob | null>((resolve) => {
    // Keep PNG to avoid backend conversion surprises; we rely on downscaling for size reduction.
    canvas.toBlob((b) => resolve(b), 'image/png');
  });

  return outBlob ?? blob;
};

/**
 * Downloads a blob as a file
 */
export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Copies a blob to clipboard as an image
 * Falls back to native share on iOS where clipboard API doesn't support images
 */
export const copyBlobToClipboard = async (blob: Blob): Promise<void> => {
  // iOS Safari doesn't support clipboard.write() with images
  // Use Web Share API as fallback
  if (isIOS()) {
    if (navigator.share && navigator.canShare) {
      const file = new File([blob], 'wrap-card.png', { type: 'image/png' });
      const shareData = { files: [file] };
      
      if (navigator.canShare(shareData)) {
        await navigator.share(shareData);
        return;
      }
    }
    // If share API not available, throw with helpful message
    throw new Error('iOS_NOT_SUPPORTED');
  }

  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob
      })
    ]);
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    throw error;
  }
};

/**
 * Uploads image blob to backend and returns public URL
 * @param blob - The image blob to upload
 * @param endpoint - Your backend endpoint URL
 * @returns The public URL of the uploaded image
 */
export const uploadImageToBackend = async (
  blob: Blob,
  endpoint: string
): Promise<string> => {
  // Convert blob to base64 data URI
  const reader = new FileReader();
  const dataUriPromise = new Promise<string>((resolve, reject) => {
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
  });
  reader.readAsDataURL(blob);
  const dataUri = await dataUriPromise;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      images: [dataUri],
    }),
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.url; // Expects { url: "https://..." } from your backend
};

/**
 * Generates the Twitter/X share intent URL
 */
export const generateTwitterShareUrl = (text: string, url?: string): string => {
  const params = new URLSearchParams();
  params.set('text', text);
  if (url) {
    params.set('url', url);
  }
  return `https://twitter.com/intent/tweet?${params.toString()}`;
};

/**
 * Opens Twitter share intent (iOS compatible with twitter:// deep link)
 */
export const shareOnTwitter = (text: string, url?: string): void => {
  const webUrl = generateTwitterShareUrl(text, url);

  if (isIOS()) {
    // iOS: Use twitter:// deep link to open X app directly
    const fullMessage = url ? `${text}\n${url}` : text;
    const twitterAppUrl = `twitter://post?message=${encodeURIComponent(fullMessage)}`;

    // Try to open X app
    window.location.href = twitterAppUrl;

    // Fallback to web after delay if app doesn't open
    setTimeout(() => {
      window.location.href = webUrl;
    }, 1500);
  } else {
    // Android/Desktop: open in new tab
    window.open(webUrl, '_blank', 'noopener,noreferrer');
  }
};
