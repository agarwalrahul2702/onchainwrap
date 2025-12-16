import posthog from 'posthog-js';

// Initialize PostHog - replace with your actual host if using EU cloud
const POSTHOG_KEY = 'phc_EhQHDuXte4KaqsQF8ucLO5CwHiXLLGYvLqS8JV0dJM2';
const POSTHOG_HOST = 'https://us.i.posthog.com'; // or 'https://eu.i.posthog.com' for EU

export const initPostHog = () => {
  if (typeof window !== 'undefined') {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      person_profiles: 'identified_only',
      capture_pageview: true,
      capture_pageleave: true,
    });
  }
};

// Track custom events
export const trackEvent = (eventName: string, properties?: Record<string, unknown>) => {
  if (typeof window !== 'undefined') {
    posthog.capture(eventName, properties);
  }
};

// Event names for consistency
export const EVENTS = {
  WRAP_GENERATED: 'wrap_generated',
  CARD_DOWNLOADED: 'card_downloaded',
  CARD_COPIED: 'card_copied',
  CARD_SHARED_X: 'card_shared_x',
  TRY_ANOTHER_WALLET: 'try_another_wallet',
} as const;

export default posthog;
