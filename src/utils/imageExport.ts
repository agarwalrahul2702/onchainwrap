import html2canvas from 'html2canvas';

export interface ExportOptions {
  pixelRatio?: number;
  backgroundColor?: string | null;
}

// Detect iOS
const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent));
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
 * Captures a DOM element as a PNG blob using html2canvas (iOS compatible)
 * This function expects a snapshot element with fixed absolute positioning.
 */
export const captureElementAsBlob = async (
  element: HTMLElement,
  options: ExportOptions = {}
): Promise<Blob> => {
  const { pixelRatio = 3, backgroundColor = null } = options;

  // Wait for fonts and images to load before capture
  await waitForFonts();
  await waitForImages(element);

  // Capture ONLY the provided node at the final resolution (no post-resize)
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
