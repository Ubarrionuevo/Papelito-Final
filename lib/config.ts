// Simple configuration for simulation mode
export const appConfig = {
  freeTrialCredits: 1, // Solo 1 intento gratuito por usuario nuevo
  maxImageSize: 10 * 1024 * 1024, // 10MB
  maxImagePixels: 4096 * 4096, // 4096x4096 pixels
  supportedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  processingTimeout: 5 * 60 * 1000, // 5 minutes
};

export const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 5,
    currency: 'USD',
    credits: 1000,
    interval: 'monthly' as const,
    features: [
      '1000 colorizations',
      'High resolution output',
      'Multiple export formats',
      'Professional AI models',
      'Commercial usage rights',
      'Credits never expire'
    ],
    popular: true,
    badge: {
      text: 'Perfect for starters',
      color: 'bg-yellow-50 text-yellow-800'
    }
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 10,
    currency: 'USD',
    credits: 3000,
    interval: 'one-time' as const,
    features: [
      '3000 colorizations',
      'High resolution output',
      'Multiple export formats',
      'Professional AI models',
      'Commercial usage rights',
      'Credits never expire'
    ],
    popular: false,
    badge: {
      text: 'Best value',
      color: 'bg-blue-50 text-blue-800'
    }
  }
];
