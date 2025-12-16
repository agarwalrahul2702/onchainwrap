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
  PAGE_VIEW: 'page_view',
  WRAP_GENERATED: 'wrap_generated',
  CARD_DOWNLOADED: 'card_downloaded',
  CARD_COPIED: 'card_copied',
  CARD_SHARED_X: 'card_shared_x',
  TRY_ANOTHER_WALLET: 'try_another_wallet',
} as const;
