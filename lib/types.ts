// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name?: string;
  credits: number;
  subscription?: Subscription;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'expired';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

// Payment and Plan Types
export interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  credits: number;
  interval?: 'monthly' | 'yearly' | 'one-time';
  features: string[];
  popular?: boolean;
  badge?: {
    text: string;
    color: string;
  };
}

export interface PaymentIntent {
  id: string;
  userId: string;
  planId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed';
  clientSecret: string;
  createdAt: Date;
}

// Credit and Usage Types
export interface CreditTransaction {
  id: string;
  userId: string;
  type: 'purchase' | 'usage' | 'refund' | 'bonus';
  amount: number;
  balance: number;
  description: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface ImageProcessingJob {
  id: string;
  userId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  originalImageUrl: string;
  colorizedImageUrl?: string;
  error?: string;
  creditsUsed: number;
  createdAt: Date;
  updatedAt: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface CreditCheckResponse {
  hasCredits: boolean;
  currentCredits: number;
  requiredCredits: number;
  canProcess: boolean;
}

// Environment and Configuration
export interface AppConfig {
  freeTrialCredits: number;
  maxImageSize: number;
  maxImagePixels: number;
  supportedFormats: string[];
  processingTimeout: number;
}
