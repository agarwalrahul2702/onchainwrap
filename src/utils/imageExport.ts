import { toPng } from 'html-to-image';

export interface ExportOptions {
  pixelRatio?: number;
  backgroundColor?: string;
}

/**
 * Captures a DOM element as a PNG blob
 */
export const captureElementAsBlob = async (
  element: HTMLElement,
  options: ExportOptions = {}
): Promise<Blob> => {
  const { pixelRatio = 2, backgroundColor = '#0a1628' } = options;

  const dataUrl = await toPng(element, {
    pixelRatio,
    backgroundColor,
    cacheBust: true,
    skipAutoScale: true,
    filter: (node) => {
      // Skip any elements that might cause issues
      if (node instanceof HTMLElement) {
        const tagName = node.tagName?.toLowerCase();
        // Skip video elements if any
        if (tagName === 'video') return false;
      }
      return true;
    },
  });

  // Convert data URL to blob
  const response = await fetch(dataUrl);
  return response.blob();
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
 */
export const copyBlobToClipboard = async (blob: Blob): Promise<void> => {
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
 * Opens Twitter share intent in a new tab
 */
export const shareOnTwitter = (text: string, url?: string): void => {
  const shareUrl = generateTwitterShareUrl(text, url);
  window.open(shareUrl, '_blank', 'noopener,noreferrer');
};
