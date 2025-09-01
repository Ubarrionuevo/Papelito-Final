// Basic types for simulation - no real database needed
export interface User {
  id: string;
  email: string;
  name?: string;
  credits: number;
  createdAt: Date;
  updatedAt: Date;
}

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
