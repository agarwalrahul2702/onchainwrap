// Google Analytics 4 tracking utility

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

// Track custom events in GA4
export const trackGA4Event = (eventName: string, parameters?: Record<string, unknown>) => {
  if (typeof window === 'undefined') return;

  // Prefer gtag if available
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, parameters);
    // Helpful while debugging; harmless in production
    console.debug?.('[ga4] event sent', eventName, parameters);
    return;
  }

  // Fallback: push directly to dataLayer
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push(['event', eventName, parameters]);
    console.debug?.('[ga4] event queued (dataLayer)', eventName, parameters);
  } else {
    console.warn?.('[ga4] gtag not available; event dropped', eventName, parameters);
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
