// API Response Types for FLUX Kontext
export interface FluxKontextRequest {
  prompt: string;
  input_image: string;
  aspect_ratio?: string;
  output_format?: string;
  safety_tolerance?: number;
}

export interface FluxKontextResponse {
  id: string;
  polling_url: string;
  status: string;
}

export interface FluxKontextResult {
  status: 'Ready' | 'Processing' | 'Error' | 'Failed';
  result?: {
    sample: string;
  };
  error?: string;
}

export interface ColorizeRequest {
  prompt: string;
  input_image: string;
  aspect_ratio?: string;
  output_format?: string;
}

export interface ColorizeResponse {
  success: boolean;
  data: {
    id: string;
    polling_url: string;
    status: string;
  };
  message: string;
  error?: string;
}

export interface ColorizationResult {
  original: string;
  colorized: string;
  timestamp: Date;
  prompt: string;
}

