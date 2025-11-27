// API Response Types for OCR and Documents
export interface OCRRequest {
  image: string; // base64 encoded image
}

export interface OCRResponse {
  success: boolean;
  data?: {
    text: string;
    metadata: {
      type?: string; // factura, remito, presupuesto, contrato
      date?: string;
      provider?: string; // proveedor/cliente
      amount?: number;
      number?: string; // número de documento
    };
    classification: {
      documentType: string;
      provider: string;
      project?: string; // proyecto/obra
      month?: string;
      year?: string;
    };
  };
  error?: string;
}

export interface Document {
  id: string;
  userId: string;
  imageUrl: string; // base64 or URL
  text: string; // texto completo extraído
  metadata: {
    type?: string;
    date?: string;
    provider?: string;
    amount?: number;
    number?: string;
  };
  classification: {
    documentType: string;
    provider: string;
    project?: string;
    month?: string;
    year?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentRequest {
  userId: string;
  image: string; // base64 encoded image
  ocrData?: OCRResponse['data'];
}

export interface DocumentResponse {
  success: boolean;
  data?: Document;
  error?: string;
}

export interface DocumentsListResponse {
  success: boolean;
  data?: Document[];
  total?: number;
  error?: string;
}

export interface DocumentSearchRequest {
  userId: string;
  query?: string; // búsqueda por texto
  type?: string;
  provider?: string;
  project?: string;
  month?: string;
  year?: string;
  limit?: number;
  offset?: number;
}

export interface ColorizeRequest {
  prompt: string;
  input_image: string; // base64 encoded image
  aspect_ratio?: string; // e.g., "1:1", "16:9"
  output_format?: string; // e.g., "jpeg", "png"
}

export interface ColorizationResult {
  original: string; // URL or base64 of original image
  colorized: string; // URL or base64 of colorized image
  timestamp: Date;
  prompt: string;
}

