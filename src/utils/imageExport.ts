import html2canvas from 'html2canvas';

export interface ExportOptions {
  pixelRatio?: number;
  backgroundColor?: string;
}

// Detect iOS
const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent));
};

/**
 * Captures a DOM element as a PNG blob using html2canvas (iOS compatible)
 */
export const captureElementAsBlob = async (
  element: HTMLElement,
  options: ExportOptions = {}
): Promise<Blob> => {
  const { pixelRatio = 3, backgroundColor = '#0a1628' } = options;

  // Use html2canvas which has better iOS support
  const canvas = await html2canvas(element, {
    scale: isIOS() ? 2 : pixelRatio,
    backgroundColor,
    useCORS: true,
    allowTaint: false,
    logging: false,
    imageTimeout: 15000,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
    onclone: (clonedDoc, clonedElement) => {
      // Ensure cloned images have crossOrigin set
      const images = clonedDoc.querySelectorAll('img');
      images.forEach((img) => {
        img.crossOrigin = 'anonymous';
      });
      // Force the cloned element to have consistent dimensions
      clonedElement.style.width = `${element.offsetWidth}px`;
      clonedElement.style.height = `${element.offsetHeight}px`;
    },
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
