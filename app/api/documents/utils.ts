import { Document } from '../../../types/api';

// In-memory storage for demo purposes
// In production, you should use a database (PostgreSQL, MongoDB, etc.)
const documents = new Map<string, Document>();

// Get the documents map for use in route handlers
export function getDocumentsMap() {
  return documents;
}

// Helper function to generate document ID
export function generateDocumentId(): string {
  return 'doc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

