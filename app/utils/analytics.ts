// Simple analytics utility for Google Analytics
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: Record<string, unknown>) => void;
  }
}

// Track custom events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track page views (if needed for SPA navigation)
export const trackPageView = (page_path: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-5Z2B6143QE', {
      page_path: page_path,
    });
  }
};

// Specific tracking functions for your app
export const analytics = {
  // User actions
  documentProcessingStarted: () => {
    trackEvent('document_processing_started', 'user_action', 'document_processing');
  },
  
  documentProcessingCompleted: () => {
    trackEvent('document_processing_completed', 'user_action', 'document_processing');
  },
  
  creditUsed: (remainingCredits: number) => {
    trackEvent('credit_used', 'user_action', 'credit_consumption', remainingCredits);
  },
  
  // Conversion events
  pricingViewed: (plan?: string) => {
    trackEvent('pricing_viewed', 'conversion', plan || 'pricing_section');
  },
  
  purchaseInitiated: (plan: string, price: number) => {
    trackEvent('purchase_initiated', 'conversion', plan, price);
  },
  
  purchaseCompleted: (plan: string, price: number) => {
    trackEvent('purchase_completed', 'conversion', plan, price);
  },
  
  // User engagement
  appOpened: () => {
    trackEvent('app_opened', 'engagement', 'document_app');
  },
  
  freeTrialUsed: () => {
    trackEvent('free_trial_used', 'engagement', 'first_time_user');
  },
  
  // Error tracking
  errorOccurred: (errorType: string) => {
    trackEvent('error_occurred', 'error', errorType, undefined);
  }
};
