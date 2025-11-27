import { NextRequest, NextResponse } from 'next/server';
import { DocumentSearchRequest, Document } from '../../../../types/api';
import { getDocumentsMap } from '../utils';

// Get the documents map
const documents = getDocumentsMap();

export async function POST(request: NextRequest) {
  try {
    const body: DocumentSearchRequest = await request.json();
    const { userId, query, type, provider, project, month, year, limit = 50, offset = 0 } = body;

    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'userId is required' 
      }, { status: 400 });
    }

    // Get all documents from the shared storage
    // In production, this would be a database query
    let userDocuments = Array.from(documents.values())
      .filter((doc: Document) => doc.userId === userId);

    // Text search
    if (query) {
      const searchQuery = query.toLowerCase();
      userDocuments = userDocuments.filter((doc: Document) => {
        return (
          doc.text?.toLowerCase().includes(searchQuery) ||
          doc.metadata.provider?.toLowerCase().includes(searchQuery) ||
          doc.metadata.number?.toLowerCase().includes(searchQuery) ||
          doc.classification.provider?.toLowerCase().includes(searchQuery) ||
          doc.classification.project?.toLowerCase().includes(searchQuery)
        );
      });
    }

    // Filter by metadata
    if (type) {
      userDocuments = userDocuments.filter((doc: Document) => 
        doc.metadata.type === type || doc.classification.documentType === type
      );
    }

    if (provider) {
      userDocuments = userDocuments.filter((doc: Document) => 
        doc.metadata.provider?.toLowerCase().includes(provider.toLowerCase()) ||
        doc.classification.provider?.toLowerCase().includes(provider.toLowerCase())
      );
    }

    if (project) {
      userDocuments = userDocuments.filter((doc: Document) => 
        doc.classification.project?.toLowerCase().includes(project.toLowerCase())
      );
    }

    if (month) {
      userDocuments = userDocuments.filter((doc: Document) => 
        doc.classification.month === month
      );
    }

    if (year) {
      userDocuments = userDocuments.filter((doc: Document) => 
        doc.classification.year === year
      );
    }

    // Sort by relevance (if query) or by date
    if (query) {
      // Simple relevance: documents with query in text come first
      userDocuments.sort((a: Document, b: Document) => {
        const aRelevance = a.text?.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
        const bRelevance = b.text?.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
        return bRelevance - aRelevance;
      });
    } else {
      // Sort by createdAt (newest first)
      userDocuments.sort((a: Document, b: Document) => 
        b.createdAt.getTime() - a.createdAt.getTime()
      );
    }

    // Apply pagination
    const total = userDocuments.length;
    const paginatedDocuments = userDocuments.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: paginatedDocuments,
      total
    });

  } catch (error) {
    console.error('Document search error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

