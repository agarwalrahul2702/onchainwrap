// Google Analytics 4 tracking utility

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

// Track custom events in GA4
export const trackGA4Event = (eventName: string, parameters?: Record<string, unknown>) => {
  if (typeof window === 'undefined') return;
  
  if (window.gtag) {
    window.gtag('event', eventName, parameters);
    console.log('[GA4] Event fired:', eventName, parameters);
  } else {
    console.warn('[GA4] gtag not available, event not sent:', eventName);
  }
};

// Event names for consistency
export const GA_EVENTS = {
  GENERATE_WRAP: 'generate_wrap',
  SHARE_X: 'share_x',
  COPY_WRAP: 'copy_wrap',
  TRY_ANOTHER_WALLET: 'try_another_wallet',
  DOWNLOAD_IMAGE: 'download_image',
  TRY_0XPPL: 'try_0xppl',
  ADD_MORE_WALLETS: 'add_more_wallets',
} as const;
